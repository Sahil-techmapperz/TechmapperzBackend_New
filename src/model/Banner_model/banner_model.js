const mongoose =require('mongoose')

const BannerSchema=new mongoose.Schema ({
    heading: {type:String},
    banner_img_url: {type:String},
    userId:{type:String},
    subTitle:{type:String}
});

let Bannermodel=mongoose.model("banner",BannerSchema)

module.exports=Bannermodel;