package net.essaid.projetpfa.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async; // Importer @Async
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Async // Rendre cette méthode asynchrone
    public void sendHtmlEmail(String toEmail, String subject, String templateName, Map<String, Object> templateModel) {
        try {
            Context context = new Context();
            context.setVariables(templateModel);

            String htmlContent = templateEngine.process(templateName, context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom("essaid.zakaria5@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indique que le contenu est HTML

            mailSender.send(mimeMessage);
            logger.info("HTML Mail Sent Successfully to {}", toEmail);

        } catch (MessagingException | MailException e) {
            logger.error("Failed to send HTML email to {}: {}", toEmail, e.getMessage());
        }
    }
}
