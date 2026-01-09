import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Link,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface PurchaseConfirmationEmailProps {
  customerEmail: string;
  plugins: Array<{ id: string; name: string }>;
  orderTotal: number;
  orderId: string;
  downloadLinks?: Array<{
    pluginName: string;
    macDownloadUrl: string;
    windowsDownloadUrl: string;
  }>;
  licenseKey?: string;
  tapeBloomLicenseKey?: string;
}

export default function PurchaseConfirmationEmail({
  customerEmail,
  plugins,
  orderTotal,
  orderId,
  downloadLinks = [],
  licenseKey,
  tapeBloomLicenseKey,
}: PurchaseConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Turnt Plugins are ready to download!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={title}>TURNT PLUGINS</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Thank You for Your Purchase!</Heading>
            <Text style={text}>
              Your payment has been processed successfully. Here are the details of your order:
            </Text>

            {/* Order Details */}
            <Section style={orderBox}>
              <Text style={orderTitle}>Order Details</Text>
              <Hr style={hr} />
              <Text style={text}>
                <strong>Order ID:</strong> {orderId}
              </Text>
              <Text style={text}>
                <strong>Email:</strong> {customerEmail}
              </Text>
              <Text style={text}>
                <strong>Total:</strong> ${(orderTotal / 100).toFixed(2)}
              </Text>
            </Section>

            {/* Plugins List */}
            <Section style={pluginsBox}>
              <Text style={orderTitle}>Your Plugins:</Text>
              <Hr style={hr} />
              {plugins.map((plugin, index) => (
                <Text key={plugin.id} style={pluginItem}>
                  {index + 1}. {plugin.name}
                </Text>
              ))}
            </Section>

            {/* License Key Section (for VocalFelt) */}
            {licenseKey && (
              <Section style={licenseBox}>
                <Text style={orderTitle}>🎫 VocalFelt Activation Code:</Text>
                <Hr style={hr} />
                <Text style={licenseKeyText}>{licenseKey}</Text>
                <Text style={text}>
                  Download and install VocalFelt from the links below, then enter this activation code into the splash screen when you first load the plugin.
                </Text>
                <Text style={text}>
                  <strong>Note:</strong> Keep this code safe! You can always access it from your downloads page.
                </Text>
              </Section>
            )}

            {/* License Key Section (for TapeBloom) */}
            {tapeBloomLicenseKey && (
              <Section style={tapeBloomLicenseBox}>
                <Text style={orderTitle}>🎫 TapeBloom Activation Code:</Text>
                <Hr style={hr} />
                <Text style={licenseKeyText}>{tapeBloomLicenseKey}</Text>
                <Text style={text}>
                  Download and install TapeBloom from the links below, then enter this activation code into the splash screen when you first load the plugin.
                </Text>
                <Text style={text}>
                  <strong>Note:</strong> Keep this code safe! You can always access it from your downloads page.
                </Text>
              </Section>
            )}

            {/* Download Links */}
            {downloadLinks.length > 0 && (
              <Section style={downloadsBox}>
                <Text style={orderTitle}>Download Your Plugins:</Text>
                <Hr style={hr} />
                <Text style={text}>
                  Your download links are ready! Click the buttons below to download your plugins.
                  These links will expire in 3 days.
                </Text>
                {downloadLinks.map((link, index) => (
                  <div key={index} style={downloadItem}>
                    <Text style={downloadText}>{link.pluginName}</Text>
                    <div style={buttonContainer}>
                      <Button
                        href={link.macDownloadUrl}
                        style={downloadButton}
                      >
                        Download for macOS
                      </Button>
                      <div style={{ width: '10px' }} />
                      <Button
                        href={link.windowsDownloadUrl}
                        style={downloadButton}
                      >
                        Download for Windows
                      </Button>
                    </div>
                  </div>
                ))}
                <Text style={text}>
                  <strong>Lost your download links?</strong> Visit{' '}
                  <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/downloads`} style={link}>
                    My Downloads
                  </Link>{' '}
                  and enter your email to access them again.
                </Text>
              </Section>
            )}

            {/* Download Instructions */}
            <Section style={instructionsBox}>
              <Text style={orderTitle}>Installation Instructions:</Text>
              <Hr style={hr} />
              <Text style={text}>
                1. Download each plugin using the links above
              </Text>
              <Text style={text}>
                2. Follow the installation guide included with each plugin
              </Text>
              <Text style={text}>
                3. If you have any issues, reach out to us on{' '}
                <Link href="https://instagram.com/turntplugins" style={link}>
                  Instagram @turntplugins
                </Link>{' '}
                or visit our{' '}
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/support`} style={link}>
                  Contact Portal
                </Link>
              </Text>
            </Section>

            <Text style={footer}>
              You&apos;re receiving this email because you opted in to receive updates about future plugins and projects from Turnt Plugins.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2024 Turnt Plugins. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/downloads`} style={footerLink}>
                My Downloads
              </Link>
              {' • '}
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/support`} style={footerLink}>
                Contact
              </Link>
              {' • '}
              <Link href="https://instagram.com/turntplugins" style={footerLink}>
                Instagram
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Retro-inspired inline styles
const main = {
  backgroundColor: '#5DADE2',
  fontFamily: 'monospace',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#000080',
  padding: '20px',
  border: '4px solid #000000',
};

const title = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
  fontFamily: 'monospace',
};

const content = {
  backgroundColor: '#ffffff',
  border: '4px solid #000000',
  padding: '30px',
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  fontFamily: 'monospace',
};

const text = {
  color: '#000000',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '10px 0',
  fontFamily: 'monospace',
};

const orderBox = {
  backgroundColor: '#FFE66D',
  border: '3px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const pluginsBox = {
  backgroundColor: '#f0f0f0',
  border: '3px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const instructionsBox = {
  backgroundColor: '#e0e0e0',
  border: '3px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const orderTitle = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  fontFamily: 'monospace',
};

const pluginItem = {
  color: '#000000',
  fontSize: '14px',
  margin: '5px 0',
  fontFamily: 'monospace',
};

const hr = {
  borderColor: '#000000',
  margin: '10px 0',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  marginTop: '30px',
  fontFamily: 'monospace',
};

const footerSection = {
  backgroundColor: '#000080',
  padding: '15px',
  border: '4px solid #000000',
  marginTop: '20px',
};

const footerText = {
  color: '#ffffff',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
  fontFamily: 'monospace',
};

const downloadsBox = {
  backgroundColor: '#90EE90',
  border: '3px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const downloadItem = {
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  padding: '15px',
  margin: '10px 0',
};

const downloadText = {
  color: '#000000',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  fontFamily: 'monospace',
};

const downloadButton = {
  backgroundColor: '#000080',
  color: '#ffffff',
  padding: '12px 24px',
  textDecoration: 'none',
  border: '2px solid #000000',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  display: 'inline-block',
  fontSize: '14px',
};

const link = {
  color: '#000080',
  textDecoration: 'underline',
  fontFamily: 'monospace',
};

const buttonContainer = {
  display: 'flex',
  flexDirection: 'row' as const,
  gap: '10px',
  marginTop: '10px',
};

const licenseBox = {
  backgroundColor: '#FFD700',
  border: '4px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const tapeBloomLicenseBox = {
  backgroundColor: '#87CEEB',
  border: '4px solid #000000',
  padding: '20px',
  margin: '20px 0',
};

const licenseKeyText = {
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  padding: '15px',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  fontFamily: 'monospace',
  textAlign: 'center' as const,
  letterSpacing: '2px',
  margin: '15px 0',
  color: '#000000',
};

const codeStyle = {
  backgroundColor: '#f0f0f0',
  padding: '2px 6px',
  border: '1px solid #000000',
  fontFamily: 'monospace',
  fontSize: '12px',
};

const footerLink = {
  color: '#ffffff',
  textDecoration: 'underline',
  fontFamily: 'monospace',
};
