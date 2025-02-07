export const emailTemplate = (otp) => {return `<!doctype html>
<html lang="en" >
<head>
  <meta charset="utf-8">
  <title>codepen - otp email template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: helvetica,arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">NeuroGuard</a>
    </div>
    <p style="font-size:1.1em">hi,</p>
    <p>thank you for choosing NeuroGuard. use the following otp to complete your password recovery procedure. otp is valid for 1 minute</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">regards,<br />NeuroGuard</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>NeuroGuard inc</p>
      <p>1600 amphitheatre parkway</p>
      <p>california</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`
  }
