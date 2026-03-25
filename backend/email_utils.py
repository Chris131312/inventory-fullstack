import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- CONFIGURATION ---
SENDER_EMAIL = "christophermoli13@gmail.com"
SENDER_PASSWORD = "Adams131312"
ADMIN_EMAIL = "christophermoli13@gmail.com"

def send_low_stock_email(product_name: str, current_stock: int):
    """
    Sends an email alert to the administrator when a product's stock falls below a safe threshold.
    """
    try:
        #Email structure
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"ALERT: Low Stock Critical - {product_name}"

        #Email body
        body = f"""
        Hello Admin,

        The Inventory Pro system has detected that a product's inventory is below the safe threshold (less than 5 units).

        PRODUCT DETAILS:
        ----------------------
        - Name: {product_name}
        - Current Stock: {current_stock} units

        Please arrange for restocking with suppliers as soon as possible.

        Automated regards,
        Inventory Pro System
        """
        msg.attach(MIMEText(body, 'plain'))

        # --- SIMULATION MODE ---
        if SENDER_EMAIL == "your_email@gmail.com":
            print("\n" + "="*50)
            print("EMAIL SIMULATION (Real credentials missing):")
            print(f"To: {ADMIN_EMAIL}")
            print(f"Subject: {msg['Subject']}")
            print(body)
            print("="*50 + "\n")
            return

        # --- PRODUCTION MODE  ---
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, ADMIN_EMAIL, text)
        server.quit()
        
        print(f" Low stock alert successfully sent to {ADMIN_EMAIL}")

    except Exception as e:
        print(f" Internal error while attempting to send email: {e}")