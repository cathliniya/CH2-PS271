// fixed add translate and update fungsi translate
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
      id: id
    },
    include: Translate_gambar
  });

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Oops data translate tidak ditemukan.'
      });
  }

  res.json(translate);
}

const getTranslateByIdV2 = async (req, res) => {
  const id = req.params.id;

  const translate = await Translate.findByPk(id);

  if (!Translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Oops data translate tidak ditemukan.'
      });
  }

  const gambar = await Translate_gambar.findOne({
    where: {
      Translate: id
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
    id: 'interger',
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
    nama_huruf
  } = translate_detail;

  if (nama_huruf === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar= path.extname(req.file.originalname).toLowerCase();

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

    translate_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar.name}`;
  }

  const translate= await Translate.create(translate_detail);

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
    nama_huruf
  } = req.body;

  if (nama_huruf === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar_isyarat = path.extname(req.file.originalname).toLowerCase();

    if (ext_gambar_isyarat !== '.png' && ext_gambar_isyarat !== '.jpg' && ext_gambar_isyarat !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar_isyarat = `${uuidv1()}-${req.file.originalname}`;
    const blob_gambar_isyarat = bucket.file(newFilename_gambar_isyarat);
    const blobStream_gambar_isyarat = blob_gambar_isyarat.createWriteStream();

    blobStream_gambar_isyarat.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar_isyarat.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar_isyarat.end(req.file.buffer);

    if (translate.gambar_isyarat) {
      const gambar_isyarat_old = translate.gambar_isyarat.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await bucket.file(gambar_isyarat_old).delete();
      } catch (error) {
        console.log(error);
      }
    }


    translate_detail.gambar_isyarat = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar_isyarat.name}`;
  } else {
    translate_detail.gambar_isyarat = translate.gambar_isyarat;
  }

  translate = await translate.update(translate_detail);

  res.json(translate);
}

const deleteTranslate = async (req, res) => {
  const id = req.params.id;

  const translate = await Translate.findOne({
    where: {
      id: id
    },
    include: Translate_gambar
  });

  if (!translate) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data translate tidak ditemukan.'
      });
  }

  if (translate.gambar_isyarat) {
    const gambar_isyarat__old = translate.gambar_isyarat.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_isyarat_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  if (translate.Translate_gambars.length !== 0) {
    const translate_gambars = translate.Translate_gambars;

    for (let translate_gambar of translate_gambars) {
      const gambar_isyarat_old = translate_gambar.gambar_isyarat.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await Translate_gambar.destroy({
          where: {
            id: id
          }
        });

        await bucket.file(gambar_isyarat_old).delete();
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