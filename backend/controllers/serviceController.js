const db = require('../db');

// Create Service
exports.createService = (req, res) => {
  console.log(`[${new Date().toISOString()}] Create service request:`, req.body, req.file);
  const {
    city_id,
    category_id,
    title,
    sub_title,
    description,
    slug,
    seo_title,
    seo_description,
    status,
    faqs,
  } = req.body;
  const image = req.file ? `/Uploads/service-image/${req.file.filename}` : req.body.image;
 
  if (!city_id || !category_id || !title || !slug) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'City ID, Category ID, Title, and Slug are required' });
  }
 
  // Validate FAQs if provided
  let parsedFaqs = null;
  if (faqs) {
    try {
      parsedFaqs = JSON.parse(faqs);
      if (!Array.isArray(parsedFaqs)) {
        return res.status(400).json({ error: 'FAQs must be an array' });
      } 
      // Validate FAQ structure
      for (const faq of parsedFaqs) {
        if (!faq.question || !faq.answer) {
          return res.status(400).json({ error: 'Each FAQ must have a question and answer' });
        }
      }
    } catch (error) {
      console.error('Invalid FAQs format:', error);
      return res.status(400).json({ error: 'Invalid FAQs format' });
    }
  }

  // Check for duplicate slug within the same city
  const checkSlugQuery = 'SELECT id FROM services WHERE slug = ? AND city_id = ?';
  db.query(checkSlugQuery, [slug, city_id], (err, results) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Check slug error:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      console.log(`Slug ${slug} already exists for city_id ${city_id}`);
      return res.status(400).json({ error: 'Slug must be unique within the city' });
    }

    const query = `
      INSERT INTO services
      (city_id, category_id, title, sub_title, description, slug, seo_title, seo_description, image, status, faqs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        city_id,
        category_id,
        title,
        sub_title || '',
        description || '',
        slug,
        seo_title || '',
        seo_description || '',
        image,
        status !== undefined ? status : 1,
        parsedFaqs ? JSON.stringify(parsedFaqs) : null,
      ],
      (err, result) => {
        if (err) {
          console.error(`[${new Date().toISOString()}] Create service error:`, err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log(`Service created with ID: ${result.insertId}`);
        res.status(201).json({ message: 'Service created successfully', serviceId: result.insertId });
      } 
    );
  });
};
// Update Service
exports.updateService = (req, res) => {
  const { id } = req.params;
  const getImageQuery = 'SELECT image, city_id FROM services WHERE id = ?';
  db.query(getImageQuery, [id], (err, result) => {
    if (err) {
      console.error('Error fetching existing service:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const existingImage = result[0].image;
    const existingCityId = result[0].city_id;
    const {
      city_id,
      category_id,
      title,
      sub_title,
      description,
      slug,
      seo_title,
      seo_description,
      status,
      faqs, // FAQs field
    } = req.body;
    const image = req.file ? `/Uploads/service-image/${req.file.filename}` : existingImage;
    
    // Validate FAQs if provided
    let parsedFaqs = null;
    if (faqs) {
      try {
        parsedFaqs = JSON.parse(faqs);
        if (!Array.isArray(parsedFaqs)) {
          return res.status(400).json({ error: 'FAQs must be an array' });
        }
        for (const faq of parsedFaqs) {
          if (!faq.question || !faq.answer) {
            return res.status(400).json({ error: 'Each FAQ must have a question and answer' });
          }
        }
      } catch (error) {
        console.error('Invalid FAQs format:', error);
        return res.status(400).json({ error: 'Invalid FAQs format' });
      }
    } 
    // Check for duplicate slug within the same city (excluding current service)
    const checkSlugQuery = 'SELECT id FROM services WHERE slug = ? AND city_id = ? AND id != ?';
    db.query(checkSlugQuery, [slug, city_id || existingCityId, id], (err, results) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] Check slug error:`, err);
        return res.status(500).json({ error: 'Database error' });
      }    
      if (results.length > 0) {
        console.log(`Slug ${slug} already exists for city_id ${city_id || existingCityId}`);
        return res.status(400).json({ error: 'Slug must be unique within the city' });
      }

      const query = `
        UPDATE services SET
        city_id = ?, category_id = ?, title = ?, sub_title = ?, description = ?,
        slug = ?, seo_title = ?, seo_description = ?, image = ?, status = ?, faqs = ?
        WHERE id = ?
      `;    
      db.query( 
        query, 
        [
          city_id || existingCityId,
          category_id,
          title,
          sub_title || '',
          description || '',
          slug,
          seo_title || '',
          seo_description || '',
          image,
          status,
          parsedFaqs ? JSON.stringify(parsedFaqs) : null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service not found' });
          }
          res.json({ message: 'Service updated successfully' });
        }  
      );
    }); 
  }); 
}; 
// Get All Services (No change needed unless you want FAQs in this response)
exports.getServices = (req, res) => {
  console.log(`[${new Date().toISOString()}] Get services request:`, req.query);
  const { city_id, category_id } = req.query;
  let query = `
    SELECT s.*, c.name AS city_name, c.slug AS city_slug, cat.name AS category_name, cat.slug AS category_slug
    FROM services s
    LEFT JOIN cities c ON s.city_id = c.id
    LEFT JOIN categories cat ON s.category_id = cat.id
  `;         
  let queryParams = [];
 
  if (city_id && category_id) {
    query += ' WHERE s.city_id = ? AND s.category_id = ?';
    queryParams = [city_id, category_id];
  }      

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Get services error:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    // Parse FAQs for each service
    results = results.map((service) => {
      if (service.faqs) {
        try {
          service.faqs = JSON.parse(service.faqs);
        } catch (error) {
          console.error(`Error parsing FAQs for service ${service.id}:`, error);
          service.faqs = [];
        }
      } else {
        service.faqs = [];
      }
      return service;
    }); 
    console.log(`Fetched ${results.length} services`);
    res.json(results);
  }); 
};  
// Get Service by ID
exports.getServiceById = (req, res) => {
  console.log(`[${new Date().toISOString()}] Get service request for ID ${req.params.id}`);
  const { id } = req.params;
  const query = `
    SELECT s.*, c.name AS city_name, c.slug AS city_slug, cat.name AS category_name, cat.slug AS category_slug
    FROM services s
    LEFT JOIN cities c ON s.city_id = c.id
    LEFT JOIN categories cat ON s.category_id = cat.id
    WHERE s.id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Get service by ID error:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      console.log(`Service ID ${id} not found`);
      return res.status(404).json({ error: 'Service not found' });
    }
    // Parse FAQs if present
    if (results[0].faqs) {
      results[0].faqs = JSON.parse(results[0].faqs);
    }
    console.log(`Fetched service ID ${id}`);
    res.json(results[0]);
  });
};

// Get Service by Slug
exports.getServiceBySlug = (req, res) => {
  console.log(`[${new Date().toISOString()}] Get service request for slug ${req.params.serviceSlug} in city ${req.params.citySlug} and category ${req.params.categorySlug}`);
  const { citySlug, categorySlug, serviceSlug } = req.params;
  const query = `
    SELECT s.*, c.name AS city_name, c.slug AS city_slug, cat.name AS category_name, cat.slug AS category_slug
    FROM services s
    JOIN cities c ON s.city_id = c.id
    JOIN categories cat ON s.category_id = cat.id
    WHERE s.slug = ? AND c.slug = ? AND cat.slug = ?
  `;
  db.query(query, [serviceSlug, citySlug, categorySlug], (err, results) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Get service by slug error:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      console.log(`Service slug ${serviceSlug} not found for city ${citySlug} and category ${categorySlug}`);
      return res.status(404).json({ error: 'Service not found' });
    }
    // Parse FAQs if present
    if (results[0].faqs) {
      results[0].faqs = JSON.parse(results[0].faqs);
    }
    console.log(`Fetched service slug ${serviceSlug} for city ${citySlug}`);
    res.json(results[0]);
  });

};
// Delete Service (No change needed)
exports.deleteService = (req, res) => {
  console.log(`[${new Date().toISOString()}] Delete service request for ID ${req.params.id}`);
  const { id } = req.params;
  const query = 'DELETE FROM services WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Delete service error:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      console.log(`Service ID ${id} not found`);
      return res.status(404).json({ error: 'Service not found' });
    }
    console.log(`Service ID ${id} deleted`);
    res.json({ message: 'Service deleted successfully' });
  });
};

