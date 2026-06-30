async function judge(){

  const response = await fetch("/judge", {
  
    method:"POST",
    headers : {
      "content-type" : "application/json"
    },
    body: JSON.stringify({
    message : document.getElementById("input").value
  })
  });
  
  const data = await response.json();
  
  document.getElementById("output").value = data.reply;
}