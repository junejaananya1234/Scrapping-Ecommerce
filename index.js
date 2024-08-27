import fs from "fs"
import axios from "axios"
import * as cheerio from "cheerio";
import * as XLSX from "xlsx";

 const filepath = "./amazon-watches.txt"
 const excelFilePath = "./watches-data.xlsx"

  const scrapping =  async ()=>{
   try {
   //  const response =  await axios.get("https://www.amazon.in/s?k=titan+watches+for+women&i=watches&crid=274CQB7Q1JMKT&sprefix=ti%2Cwatches%2C220&ref=nb_sb_ss_pltr-sample-20_2_2")
   // //  console.log(response.data)
   //  writeFile(filepath, response.data)
    const data = fs.readFileSync(filepath,'utf8')
    const $ = cheerio.load(data);
   //  $(`.a-size-base-plus.a-color-base.a-text-normal`).each((index,tag)=>{
   //      console.log($(tag).text())
   //  })
   //  $(`.a-price-whole`).each((index,tag)=>{
   //        console.log($(tag).text())
   //  })
   //  $(`.a-icon-alt`).each((index,tag)=>{
   //      console.log($(tag).text())
   //  })
   //  $(`.a-size-base.a-color-price`).each((index,tag)=>{
   //      console.log($(tag).text())
   //  })

   //--> Extracting data from cherrio and storing them into an array of object

   const watches = [];
   $(`.s-main-slot .s-result-item`).each((index,item)=>{
    const product = $(item).find(`.a-size-base-plus.a-color-base.a-text-normal`).text().trim()
    const price = $(item).find(`.a-price-whole`).text().trim();
    const rating = $(item).find(`.a-icon-alt`).text().trim();
    const stockstatus = $(item).find(`.a-size-base.a-color-price`).text().trim();

    watches.push({
      Name : product,
      Price : price,
      Rating : rating,
      StockStatus : stockstatus

   })
   })
   createExcelSheet(watches);
   // console.log(watches)
  
   } catch (error) {
    
    console.log(error);
    
   }
}
scrapping();

// creating an file to dump the watch data into that so that there is not requirement of the fetching the api again and again 

function writeFile(filepath,data){
   fs.writeFileSync(filepath,data, (err)=>{
      if(err){
         console.log("Error writing an file",err)
      } else {
         console.log("File written successfully")
      }
   })
}

 function createExcelSheet(data){
   // creating a work book and add a worksheet
   const workbook = XLSX.utils.book_new();
   const worksheet = XLSX.utils.json_to_sheet(data)

   // Append the worksheet to the workbook

   XLSX.utils.book_append_sheet(workbook,worksheet, "watches");

   // write the workbook to the file
   XLSX.writeFile(workbook,excelFilePath);
   console.log("Excel file has been created successfully")
 }