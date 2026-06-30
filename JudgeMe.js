async function judge(){

  const response = await fetch("http://localhost:3000/judge", {
  
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