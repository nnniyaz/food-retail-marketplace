package mail

import (
	"github/nnniyaz/ardo/pkg/env"
	"net/smtp"
)

func SendEmail(sendTo string, link string) error {
	SmtpUser := env.MustGetEnv("SMTP_USER")
	SmtpPass := env.MustGetEnv("SMTP_PASS")
	SmtpHost := env.MustGetEnv("SMTP_HOST")
	SmtpPort := env.MustGetEnv("SMTP_PORT")

	// Sender data.
	from := SmtpUser
	password := SmtpPass

	// smtp server configuration.
	smtpHost := SmtpHost
	smtpPort := SmtpPort

	// Receiver email address.
	to := []string{
		sendTo,
	}

	// Message.
	subject := "Subject: This is the subject\r\n"
	body := "Click on the link to confirm your email: " + link + "\r\n"

	text := subject + "\r\n" + body
	message := []byte(text)

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		return err
	}
	return nil
}
