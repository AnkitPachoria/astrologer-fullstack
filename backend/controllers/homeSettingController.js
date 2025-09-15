const conn = require('../db');
const db = conn.promise();
const path = require('path');
const fs = require('fs').promises;

// Get Home Setting (single record)
exports.getHomeSetting = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM home_setting LIMIT 1');
    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching home setting:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Add or Update Home Setting
exports.saveHomeSetting = async (req, res) => {
  try {
    const {
      email, phone, astrologer_name, title, subtitle, description, address,
      seo_title, seo_description, facebook_link, youtube_link, instagram_link,
      website_title, heading_color, service_title, service_subtitle,
      service_background_color, service_text_color, footer_background_color,
      footer_text_color, web_info, footer_heading, navbar_background_color,
      testimonials_title, testimonials_description, blog_title, blog_description,
      navbar_title, confidence
    } = req.body;

    let logo = null;
    let image = null;
    let icon_image = null;

    if (req.files) {
      if (req.files.logo) logo = `/Uploads/home-image/${req.files.logo[0].filename}`;
      if (req.files.image) image = `/Uploads/home-image/${req.files.image[0].filename}`;
      if (req.files.icon_image) icon_image = `/Uploads/home-image/${req.files.icon_image[0].filename}`;
    }

    // Check if record exists
    const [results] = await db.query('SELECT * FROM home_setting LIMIT 1');

    if (results.length > 0) {
      // Delete old images if new ones are uploaded
      const oldRecord = results[0];
      if (logo && oldRecord.logo) {
        const oldLogoPath = path.join(__dirname, '..', oldRecord.logo);
        if (await fs.access(oldLogoPath).then(() => true).catch(() => false)) {
          await fs.unlink(oldLogoPath);
        }
      }
      if (image && oldRecord.image) {
        const oldImagePath = path.join(__dirname, '..', oldRecord.image);
        if (await fs.access(oldImagePath).then(() => true).catch(() => false)) {
          await fs.unlink(oldImagePath);
        }
      }
      if (icon_image && oldRecord.icon_image) {
        const oldIconImagePath = path.join(__dirname, '..', oldRecord.icon_image);
        if (await fs.access(oldIconImagePath).then(() => true).catch(() => false)) {
          await fs.unlink(oldIconImagePath);
        }
      }

      // Update record
      const updateFields = `
        email = ?, phone = ?, astrologer_name = ?, title = ?, subtitle = ?, 
        description = ?, address = ?, seo_title = ?, seo_description = ?,
        facebook_link = ?, youtube_link = ?, instagram_link = ?,
        logo = ?, image = ?, icon_image = ?,
        website_title = ?, heading_color = ?, service_title = ?, service_subtitle = ?,
        service_background_color = ?, service_text_color = ?, footer_background_color = ?, 
        footer_text_color = ?, web_info = ?, footer_heading = ?,
        navbar_background_color = ?, testimonials_title = ?, testimonials_description = ?,
        blog_title = ?, blog_description = ?, navbar_title = ?, confidence = ?
      `;
      const params = [
        email || oldRecord.email,
        phone || oldRecord.phone,
        astrologer_name || oldRecord.astrologer_name,
        title || oldRecord.title,
        subtitle || oldRecord.subtitle,
        description || oldRecord.description,
        address || oldRecord.address,
        seo_title || oldRecord.seo_title,
        seo_description || oldRecord.seo_description, 
        facebook_link || oldRecord.facebook_link || null,
        youtube_link || oldRecord.youtube_link || null,
        instagram_link || oldRecord.instagram_link || null,
        logo || oldRecord.logo,
        image || oldRecord.image,
        icon_image || oldRecord.icon_image || null,
        website_title || oldRecord.website_title || null,
        heading_color || oldRecord.heading_color || null,
        service_title || oldRecord.service_title || null,
        service_subtitle || oldRecord.service_subtitle || null,
        service_background_color || oldRecord.service_background_color || null,
        service_text_color || oldRecord.service_text_color || null,
        footer_background_color || oldRecord.footer_background_color || null,
        footer_text_color || oldRecord.footer_text_color || null,
        web_info || oldRecord.web_info || null,
        footer_heading || oldRecord.footer_heading || null,
        navbar_background_color || oldRecord.navbar_background_color || null,
        testimonials_title || oldRecord.testimonials_title || null,
        testimonials_description || oldRecord.testimonials_description || null,
        blog_title || oldRecord.blog_title || null,
        blog_description || oldRecord.blog_description || null,
        navbar_title || oldRecord.navbar_title || null,
        confidence || oldRecord.confidence || null
      ];

      const updateSql = `UPDATE home_setting SET ${updateFields} WHERE id = ?`;
      params.push(oldRecord.id);

      await db.query(updateSql, params);
      res.json({ message: 'Home setting updated successfully' });
    } else {
      // Insert new record
      const insertSql = `
        INSERT INTO home_setting (
          email, phone, astrologer_name, title, subtitle, description, address,
          seo_title, seo_description, facebook_link, youtube_link, instagram_link, 
          logo, image, icon_image, website_title, heading_color, service_title, 
          service_subtitle, service_background_color, service_text_color, 
          footer_background_color, footer_text_color, web_info, footer_heading,
          navbar_background_color, testimonials_title, testimonials_description,
          blog_title, blog_description, navbar_title, confidence
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(insertSql, [
        email, phone, astrologer_name, title, subtitle, description, address,
        seo_title, seo_description, facebook_link, youtube_link, instagram_link, 
        logo, image, icon_image, website_title, heading_color, service_title, 
        service_subtitle, service_background_color, service_text_color, 
        footer_background_color, footer_text_color, web_info, footer_heading,
        navbar_background_color, testimonials_title, testimonials_description,
        blog_title, blog_description, navbar_title, confidence
      ]);
      res.json({ message: 'Home setting saved successfully' });
    }
  } catch (err) {
    console.error('Error saving home setting:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete Home Setting
exports.deleteHomeSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT logo, image, icon_image FROM home_setting WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    // Delete associated images
    const { logo, image, icon_image } = results[0];
    if (logo) {
      const logoPath = path.join(__dirname, '..', logo);
      if (await fs.access(logoPath).then(() => true).catch(() => false)) {
        await fs.unlink(logoPath);
      }
    }
    if (image) {
      const imagePath = path.join(__dirname, '..', image);
      if (await fs.access(imagePath).then(() => true).catch(() => false)) {
        await fs.unlink(imagePath);
      }
    } 
    if (icon_image) {
      const iconImagePath = path.join(__dirname, '..', icon_image);
      if (await fs.access(iconImagePath).then(() => true).catch(() => false)) {
        await fs.unlink(iconImagePath);
      }
    }

    await db.query('DELETE FROM home_setting WHERE id = ?', [id]);
    res.json({ message: 'Home setting deleted successfully' });
  } catch (err) {
    console.error('Error deleting home setting:', err);
    res.status(500).json({ error: 'Database error' });
  }
};