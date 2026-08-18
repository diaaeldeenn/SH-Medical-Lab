export const contactEmailTemplate = (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Message</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #F5F2EA;
    font-family: Arial, Helvetica, sans-serif;
    color: #151719;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #F5F2EA; padding: 40px 16px;"
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="620"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 620px;
            background-color: #EBE7DE;
            border: 1px solid #DCD8CF;
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                padding: 28px 32px;
                border-bottom: 1px solid #DCD8CF;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      font-size: 11px;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                      color: #686A67;
                    "
                  >
                    Portfolio / Contact
                  </td>

                  <td
                    align="right"
                    style="
                      font-size: 11px;
                      color: #686A67;
                    "
                  >
                    2026
                  </td>
                </tr>
              </table>

              <div
                style="
                  margin-top: 28px;
                  font-size: 28px;
                  line-height: 1.1;
                  font-weight: 700;
                  letter-spacing: -0.8px;
                  color: #151719;
                "
              >
                Elseady Space
              </div>

              <div
                style="
                  margin-top: 8px;
                  font-size: 13px;
                  color: #2867A8;
                  letter-spacing: 0.5px;
                "
              >
                New contact message
              </div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 32px;">

              <div
                style="
                  font-size: 13px;
                  line-height: 1.6;
                  color: #686A67;
                  margin-bottom: 24px;
                "
              >
                A new message has been submitted through your portfolio
                contact form.
              </div>

              <!-- Sender Information -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color: #F5F2EA;
                  border: 1px solid #DCD8CF;
                "
              >
                <tr>
                  <td style="padding: 20px 22px;">

                    <!-- Name -->
                    <div style="margin-bottom: 16px;">
                      <div
                        style="
                          font-size: 10px;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                          color: #686A67;
                          margin-bottom: 6px;
                        "
                      >
                        Name
                      </div>

                      <div
                        style="
                          font-size: 15px;
                          color: #151719;
                          font-weight: 600;
                        "
                      >
                        ${name}
                      </div>
                    </div>

                    <!-- Email -->
                    <div style="margin-bottom: 16px;">
                      <div
                        style="
                          font-size: 10px;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                          color: #686A67;
                          margin-bottom: 6px;
                        "
                      >
                        Email
                      </div>

                      <a
                        href="mailto:${email}"
                        style="
                          font-size: 15px;
                          color: #2867A8;
                          text-decoration: none;
                        "
                      >
                        ${email}
                      </a>
                    </div>

                    <!-- Subject -->
                    <div>
                      <div
                        style="
                          font-size: 10px;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                          color: #686A67;
                          margin-bottom: 6px;
                        "
                      >
                        Subject
                      </div>

                      <div
                        style="
                          font-size: 15px;
                          color: #151719;
                          font-weight: 600;
                        "
                      >
                        ${subject}
                      </div>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="margin-top: 28px;">

                <div
                  style="
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #686A67;
                    margin-bottom: 10px;
                  "
                >
                  Message
                </div>

                <div
                  style="
                    background-color: #151719;
                    color: #F3F0E8;
                    padding: 22px;
                    font-size: 15px;
                    line-height: 1.7;
                    border-left: 3px solid #2867A8;
                    white-space: pre-wrap;
                  "
                >
${message}
                </div>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 20px 32px;
                border-top: 1px solid #DCD8CF;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td
                    style="
                      font-size: 10px;
                      letter-spacing: 1.2px;
                      text-transform: uppercase;
                      color: #686A67;
                    "
                  >
                    Diaa Eldeen
                  </td>

                  <td
                    align="right"
                    style="
                      font-size: 10px;
                      color: #686A67;
                    "
                  >
                    Full-Stack Developer
                  </td>

                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Bottom Note -->
        <div
          style="
            max-width: 620px;
            padding-top: 16px;
            font-size: 10px;
            line-height: 1.5;
            color: #686A67;
            text-align: center;
          "
        >
          Sent automatically from Diaa Eldeen's personal portfolio.
        </div>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};
