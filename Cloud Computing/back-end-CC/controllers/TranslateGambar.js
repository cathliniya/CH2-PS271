// Changed static predict api url to dynamic using env variables
const Validator = require('fastest-validator');
const { Storage } = require('@google-cloud/storage');
var path = require('path');
const uuid = require('uuid');

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY
  }
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

const uuidv1 = uuid.v1;

const { Translate, Translate_gambar } = require('../models');

const v = new Validator();

const getAllTranslateGambar = async (req, res) => {
  const translate_gambar = await Translate_gambar.findAll({
    include: [{
      model: Translate
    }]
  });
  res.json(translate_gambar);
}

const getTranslateGambarById = async (req, res) => {
  const id = req.params.id;

  const translate_gambar = await Translate_gambar.findOne({
    where: {
      id: id
    },
    include: [{
      model: Translate
    }]
  });

  if (!translate_gambar) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data gambar translate tidak ditemukan.'
      });
  }

  res.json(translate_gambar);
}

const getTranslateGambarByTranslate = async (req, res) => {
  const id = req.params.id;

  const translate = await Translate.findByPk(id);

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan.'
      });
  }

  const translate_gambar = await Translate_gambar.findAll({
    where: {
      TranslateId: id
    },
    include: [{
      model: Translate
    }]
  });

  res.json(translate_gambar);
}

const addTranslateGambar = async (req, res) => {
  const schema = {
    TranslateId: 'number|integer|optional'
  }

  const translate_gambar_detail = JSON.parse(req.body.data);

  const validate = v.validate(translate_gambar_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    TranslateId
  } = translate_gambar_detail;

  if (TranslateId === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang dibutuhkan.'
      });
  }

  const translate = await Translate.findByPk(TranslateId);

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan.'
      });
  }

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Maaf hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg).'
        });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => {
      console.log(error);
    });

    blobStream.on('finish', async () => {
      console.log('success');
    });

    blobStream.end(req.file.buffer);

    translate_gambar_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
    const translate_gambar = await Translate_gambar.create(translate_gambar_detail);

    res.json(translate_gambar);
  } else {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang dibutuhkan.'
      });
  }
}

const deleteTranslateGambar = async (req, res) => {
  const id = req.params.id;

  const translate_gambar = await Translate_gambar.findByPk(id);

  if (!translate_gambar) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data gambar translate tidak ditemukan.'
      });
  }

  if (translate_gambar.gambar) {
    const gambar_old = translate_gambar.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  await translate_gambar.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data gambar translate telah dihapus.'
    });
}

module.exports = {
  getAllTranslateGambar,
  getTranslateGambarById,
  getTranslateGambarByTranslate,
  addTranslateGambar,
  deleteTranslateGambar
};