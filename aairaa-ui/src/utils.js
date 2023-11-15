export function getToday(){
  const now = new Date()
  const date = now.getDate();
  let datesuffix = "";
  if(date%10 == 1){      datesuffix = "st"; }
  else if(date%10 == 2){ datesuffix = "nd"; }
  else if(date%10 == 3){ datesuffix = "rd"; }
  else{                  datesuffix = "th"; }
  
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"][now.getMonth()];
  const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  return date + datesuffix + " " + month + ", " + day;
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export function json2csv_download(data){

  // Convert JSON to CSV function
  function jsonToCsv(jsonData) {
    jsonData.forEach(row=>{
      row.duration = row.last_exited - row.last_attended
    })
    console.log(jsonData)
    const header = Object.keys(jsonData[0]).join(',') + '\n';
    const csv = jsonData.map((row) =>
     Object.values(row)
      .map((value) => `"${value}"`)
      .join(',')
    );
    return header + csv.join('\n');
  }

  // Convert JSON to CSV
  const csvData = jsonToCsv(data);

  // Create a Blob from the CSV data
  const blob = new Blob([csvData], { type: 'text/csv' });

  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'data.csv';

  // Trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up
  window.URL.revokeObjectURL(url);

}