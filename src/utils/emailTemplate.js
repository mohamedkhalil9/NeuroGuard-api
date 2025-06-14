export const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#ff6b6b,#ee5a24);padding:20px;margin:0}
        .container{max-width:500px;margin:0 auto;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.15)}
        .header{background:linear-gradient(135deg,#e74c3c,#c0392b);padding:40px 20px;text-align:center;color:white;position:relative}
        .header::before{content:'';position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,.1) 1px,transparent 1px);background-size:25px 25px;animation:float 15s linear infinite}
        @keyframes float{0%{transform:translate(-15px,-15px)rotate(0deg)}100%{transform:translate(-15px,-45px)rotate(360deg)}}
        .icon{width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:50%;display:inline-block;text-align:center;line-height:60px;margin:0 auto 15px auto;animation:shake 2s infinite}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
        h1{font-size:24px;font-weight:700;position:relative;z-index:1}
        .content{padding:40px 30px;text-align:center}
        .alert{background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5;border-radius:10px;padding:15px;margin-bottom:25px;color:#991b1b;font-size:14px}
        .text{color:#374151;font-size:16px;line-height:1.6;margin-bottom:25px}
        .otp-box{background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:15px;padding:25px;margin:20px 0;position:relative;overflow:hidden}
        .otp-box::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#e74c3c,#f39c12,#27ae60,#3498db,#9b59b6);background-size:200% 100%;animation:rainbow 3s linear infinite}
        @keyframes rainbow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        .otp-label{font-size:14px;color:#64748b;margin-bottom:15px;font-weight:500}
        .otp-digits{text-align:center;margin:15px 0}
        .otp-table{margin:0 auto;border-collapse:separate;border-spacing:8px}
        .digit{width:45px;height:55px;background:white;border:2px solid #e2e8f0;border-radius:8px;text-align:center;vertical-align:middle;font-size:24px;font-weight:700;color:#1f2937;box-shadow:0 2px 4px rgba(0,0,0,.05);transition:all .3s;animation:slideIn .5s ease-out both;line-height:51px}
        .digit:nth-child(1){animation-delay:.1s}.digit:nth-child(2){animation-delay:.2s}.digit:nth-child(3){animation-delay:.3s}.digit:nth-child(4){animation-delay:.4s}.digit:nth-child(5){animation-delay:.5s}.digit:nth-child(6){animation-delay:.6s}
        @keyframes slideIn{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
        .digit:hover{border-color:#e74c3c;transform:translateY(-1px);box-shadow:0 4px 8px rgba(231,76,60,.2)}
        .full-code{font-size:13px;color:#64748b;margin:15px 0}
        .copy-instruction{background:linear-gradient(135deg,#e74c3c,#c0392b);color:white;border:none;padding:10px 25px;border-radius:20px;font-size:12px;font-weight:600;margin-top:10px;display:inline-block;text-decoration:none;box-shadow:0 4px 12px rgba(231,76,60,.3);transition:all .3s}
        .copy-instruction:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(231,76,60,.4);color:white;text-decoration:none}
        .warning{background:#fff7ed;border:1px solid #fdba74;border-radius:8px;padding:15px;margin:20px 0;font-size:14px;color:#9a3412}
        .tips{background:#f0f9ff;border:1px solid #7dd3fc;border-radius:8px;padding:15px;margin:20px 0;text-align:left}
        .tips h3{color:#0c4a6e;font-size:14px;margin-bottom:8px}
        .tips ul{margin:0;padding-left:15px;color:#075985;font-size:13px}
        .tips li{margin-bottom:5px}
        .footer{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b}
        @media(max-width:480px){
            .container{margin:10px;border-radius:15px}
            .header{padding:30px 15px}
            .content{padding:30px 20px}
            .digit{width:35px;height:45px;font-size:20px;line-height:41px}
            .otp-table{border-spacing:6px}
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">
                <svg width="30" height="30" fill="white" viewBox="0 0 24 24" style="vertical-align:middle">
                    <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
            </div>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="alert">
                <strong>Password Reset Request</strong><br>
                We received a request to reset your password. If you didn't make this request, please ignore this email.
            </div>
            
            <div class="text">
                Use the verification code below to reset your password. This code is valid for 5 minutes.
            </div>
            
            <div class="otp-box">
                <div class="otp-label">Your verification code:</div>
                <div class="otp-digits">
                    <table class="otp-table">
                        <tr>
                            <td class="digit">{{DIGIT_1}}</td>
                            <td class="digit">{{DIGIT_2}}</td>
                            <td class="digit">{{DIGIT_3}}</td>
                            <td class="digit">{{DIGIT_4}}</td>
                        </tr>
                    </table>
                </div>
                <div class="full-code">
                    <strong>Full Code:</strong> <span style="font-family:monospace;font-size:16px;background:#fff;padding:2px 6px;border-radius:4px;border:1px solid #e2e8f0">{{OTP_CODE}}</span>
                </div>
                <div style="font-size:12px;color:#64748b;margin-top:10px">
                    💡 Tip: Select and copy the code above, or manually type each digit
                </div>
            </div>
            
            <div class="warning">
                <strong>⏰ Expires in 5 minutes</strong><br>
                If it expires, you'll need to request a new password reset.
            </div>
            
            <div class="tips">
                <h3>🔒 Security Tips</h3>
                <ul>
                    <li>Never share this code with anyone</li>
                    <li>Make sure you're on our official website</li>
                    <li>Choose a strong, unique password</li>
                </ul>
            </div>
            
            <div style="margin-top:20px;font-size:13px;color:#64748b">
                Need help? Contact us at <a href="mailto:support@neurogruard.org" style="color:#e74c3c">support@neurogruard.org</a>
            </div>
        </div>
        
        <div class="footer">
            © 2025 NeuorGuard • <a href="#" style="color:#64748b">Unsubscribe</a>
        </div>
    </div>
</body>
</html>`;
