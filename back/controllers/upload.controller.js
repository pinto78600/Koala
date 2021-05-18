const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const { cloudinary } = require('../config/cloudinary');


module.exports.uploadProfil = async (req, res) => {
  const { data, dataUser, dataPicture } = req.body;
  try {

    if(dataPicture){
      if (
        dataPicture.format != "image/jpg" &&
        dataPicture.format != "image/png" &&
        dataPicture.format != "image/jpeg"
      )
        throw Error("invalid file");
    
      if (dataPicture.size > 500000) throw Error("max size");
    }
  } catch(err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  
  try{
    const uploadResponse = await cloudinary.uploader.upload(data, {
                  upload_preset: 'profil-folder',
                  public_id : dataUser.pseudo,
    })
      UserModel.findByIdAndUpdate(
                    dataUser.id,
                    { $set : {picture: uploadResponse.secure_url }},
                    { new: true, upsert: true, setDefaultsOnInsert: true},
                    (err, docs) => {
                      if (!err) return res.send(docs);
                      else return res.status(500).send({ message: err });;
                    }
                  );
  } catch (err) {
    res.status(500).send(err);
  }
};
