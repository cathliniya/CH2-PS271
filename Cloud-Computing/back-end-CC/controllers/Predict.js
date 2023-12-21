// Changed static predict api url to dynamic using env variables
const axios = require('axios');
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

const { Translate } = require('../models');

const predictMain = async (req, res) => {
  // const getRandom = await axios.post('http://34.101.125.234:8080/predict/random');
  // const randomTranslate = getRandom.data;

  // if (randomTranslate.status) {
  //   return res
  //     .status(400)
  //     .json({
  //       status: 'fail',
  //       message: 'Tidak terdeteksi'
  //     });
  // }

  // const findTranslate = await Translate.findOne({
  //   where: {
  //     nama_huruf: randomTranslate.nama_huruf
  //   }
  // });

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp') {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg, .jpeg atau .webp)'
        });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(`predict_uploads/${newFilename}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: error
        });
    });

    blobStream.on('finish', async () => {
      const filename = blob.name.replaceAll('predict_uploads/', '');;

      try {
        const getPrediction = await axios.post(process.env.API_PREDICT_HOST, {
          filename: filename
        });
        const predictedTranslate = getPrediction.data;

        const findTranslate = await Translate.findOne({
          where: {
            nama: predictedTranslate.nama
          }
        });

        if (!findTranslate) {
          const translate = await Translate.create(predictedTranslate);
          return res.json(translate);
        }

        res.json(findTranslate);
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({
            status: 'fail',
            message: 'Tidak terdeteksi'
          });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }
}

const predictRandom = async (req, res) => {
  const random_translate = [{
    nama_huruf: 'ZZ',
    deskripsi: 'ini merupakan huruf C'
  },
  {
    nama_huruf: 'AA',
    deskripsi: 'ini merupakan huruf B'
  },
  {
    nama_huruf: 'FF',
    deskripsi: 'ini merupakan huruf P'
  },
  {
    nama_huruf: 'TT',
    deskripsi: 'ini merupakan huruf J'
  },
  {
    nama_huruf: 'HH',
    deskripsi: 'ini merupakan huruf I'
  },
  {
    nama_huruf: 'EE',
    deskripsi: 'ini merupakan huruf A'
  },
  {
    status: 'fail'
  }];

  const response = random_translate[Math.floor(Math.random() * random_translate.length)];

  res.json(response);
}

module.exports = {
  predictMain,
  predictRandom
};
