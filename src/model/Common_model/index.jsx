const contactModel=require("../Contact_model/contact.model")

export const SaveData =async (data)=>{
  console.log("in save data");
    let newcontact=  new contactModel(data);
  return await newcontact.save()
}



