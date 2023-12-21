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

const getAllTranslate = async (req, res) => {
  const translate = await Translate.findAll({
    include: Translate_gambar
  });
  res.json(translate);
}

const getTranslateById = async (req, res) => {
  const id = req.params.id;

  const translate = await Translate.findOne({
    where: {
      IDt: id
    },
    include: Translate_gambar
  });

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan'
      });
  }

  res.json(translate);
}

const getTranslateByIdV2 = async (req, res) => {
  const id = req.params.id;

  const translate = await Translate.findByPk(id);

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan'
      });
  }

  const gambar = await Translate_gambar.findOne({
    where: {
      IDt: id
    }
  })

  const translateReturn = JSON.parse(JSON.stringify(translate));

  if (gambar) {
    translateReturn.gambar = gambar.gambar;
  } else {
    translateReturn.gambar = null;
  }

  res.json(translateReturn);
}

const addTranslate = async (req, res) => {
  const schema = {
    IDt: 'interger',
    user_ID: 'interger',
    gambar_ID: 'interger',
    isyarat: 'varchar',
  }

  const translate_detail = JSON.parse(req.body.data);

  const validate = v.validate(translate_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    isyarat
  } = translate_detail;

  if (isyarat === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar = path.extname(req.file.originalname).toLowerCase();

    if (ext_gambar !== '.png' && ext_gambar !== '.jpg' && ext_gambar !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar = `${uuidv1()}-${req.file.originalname}`;
    const blob_gambar = bucket.file(newFilename_gambar);
    const blobStream_gambar = blob_gambar.createWriteStream();

    blobStream_gambar.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar.end(req.file.buffer);

    satwa_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar.name}`;
  }

  const translate = await Translate.create(translate_detail);

  res.json(translate);
}

const updateTranslate = async (req, res) => {
  const id = req.params.id;

  let translate = await Translate.findByPk(id);

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan'
      });
  }

  const translate_detail = JSON.parse(req.body.data);

  const schema = {
    IDt: 'interger',
    user_ID: 'interger',
    gambar_ID: 'interger',
    isyarat: 'varchar',
  }

  const validate = v.validate(translate_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    gambar_ID
  } = req.body;

  if (gambar_ID === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar = path.extname(req.file.originalname).toLowerCase();

    if (ext_gambar !== '.png' && ext_gambar !== '.jpg' && ext_gambar !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar = `${uuidv1()}-${req.file.originalname}`;
    const blob_gambar = bucket.file(newFilename_gambar);
    const blobStream_gambar = blob_gambar.createWriteStream();

    blobStream_gambar.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar.end(req.file.buffer);

    if (transalte.gambar) {
      const gambar_old = translate.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await bucket.file(gambar_old).delete();
      } catch (error) {
        console.log(error);
      }
    }

    translate_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar.name}`;
  } else {
    translate_detail.gambar = translate.gambar;
  }

  translate = await translate.update(translate_detail);

  res.json(translate);
}

const deleteTranslate = async (req, res) => {
  const id = req.params.id;

  const translate = await Transalte.findOne({
    where: {
      IDt: id
    },
    include: Translate_gambar
  });

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan'
      });
  }

  if (translate.gambar) {
    const gambar_old = translate.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  if (translate.Translate_gambars.length !== 0) {
    const translate_gambars = translate.Translate_gambars;

    for (let translate_gambar of translate_gambars) {
      const gambar_old = translate_gambar.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await Translate_gambar.destroy({
          where: {
            IDt: translate_gambar.id
          }
        });

        await bucket.file(gambar_old).delete();
      } catch (error) {
        console.log(error);
      }
    }
  }

  await translate.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data translate telah terhapus'
    });
}

module.exports = {
  getAllTranslate,
  getTranslateById,
  getTranslateByIdV2,
  addTranslate,
  updateTranslate,
  deleteTranslate
};