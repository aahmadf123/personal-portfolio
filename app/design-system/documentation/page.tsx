"use client"

import { useState } from "react"
import {
  Container,
  Section,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Alert,
  Tooltip,
  Accordion,
  AccordionItem,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Pagination,
  Flex,
} from "@/components/design-system"

export default function ComponentDocumentation() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [showSuccessAlert, setShowSuccessAlert] = useState(true)
  const [showErrorAlert, setShowErrorAlert] = useState(true)

  return (
    <Container>
      <Section>
        <Heading level={1} align="center">
          Component Documentation
        </Heading>
        <Text align="center" size="lg" className="mt-4 mb-12">
          Detailed usage examples for design system components
        </Text>

        {/* Alert Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Alert Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Alert component is used to display important messages to the user. It comes in different variants to
              represent different types of messages.
            </Text>

            <Alert variant="info" className="mb-4">
              This is a basic info alert without a title or icon.
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Alert with Title and Icon
            </Heading>
            <Text className="mb-4">
              Add a title and icon to make your alert more noticeable and to provide more context.
            </Text>

            <Alert
              variant="info"
              title="Information"
              className="mb-4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              This is an information alert with a title and icon. Use this to provide additional information to users.
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Alert Variants
            </Heading>
            <Text className="mb-4">
              Alerts come in different variants to represent different types of messages: info, success, warning, error,
              and neutral.
            </Text>

            <Alert
              variant="success"
              title="Success"
              className="mb-4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              This is a success alert. Use this to confirm that an action was completed successfully.
            </Alert>

            <Alert
              variant="warning"
              title="Warning"
              className="mb-4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              This is a warning alert. Use this to warn users about potential issues or important considerations.
            </Alert>

            <Alert
              variant="error"
              title="Error"
              className="mb-4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              This is an error alert. Use this to inform users about errors or failed actions.
            </Alert>

            <Alert variant="neutral" title="Neutral" className="mb-4">
              This is a neutral alert. Use this for general messages that don't fit into other categories.
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Dismissible Alerts
            </Heading>
            <Text className="mb-4">
              Make alerts dismissible by adding the dismissible prop. This adds a close button that allows users to
              dismiss the alert.
            </Text>

            {showSuccessAlert && (
              <Alert
                variant="success"
                title="Success"
                dismissible
                className="mb-4"
                onDismiss={() => setShowSuccessAlert(false)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                This is a dismissible success alert. Click the X button to dismiss it.
              </Alert>
            )}

            {!showSuccessAlert && (
              <Button onClick={() => setShowSuccessAlert(true)} className="mb-4">
                Show Success Alert
              </Button>
            )}

            <Heading level={3} className="mb-4 mt-8">
              Alert Sizes
            </Heading>
            <Text className="mb-4">
              Alerts come in three sizes: small (sm), medium (md), and large (lg). The default size is medium.
            </Text>

            <Alert variant="info" size="sm" className="mb-4">
              This is a small alert. Use this when space is limited.
            </Alert>

            <Alert variant="info" size="md" className="mb-4">
              This is a medium alert (default size). Use this for most cases.
            </Alert>

            <Alert variant="info" size="lg" className="mb-4">
              This is a large alert. Use this for important messages that need more attention.
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Bordered Alerts
            </Heading>
            <Text className="mb-4">
              Add a border to your alerts by using the bordered prop. This can help make the alert stand out more.
            </Text>

            <Alert variant="info" bordered className="mb-4">
              This is a bordered alert. The border helps to visually separate the alert from surrounding content.
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">Form Submission Feedback:</Text>
            {showErrorAlert ? (
              <Alert
                variant="error"
                title="Form Submission Failed"
                dismissible
                className="mb-4"
                onDismiss={() => setShowErrorAlert(false)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                <div>
                  <Text weight="semibold" className="mb-2">
                    Please correct the following errors:
                  </Text>
                  <ul className="list-disc pl-5">
                    <li>Email address is invalid</li>
                    <li>Password must be at least 8 characters</li>
                    <li>Terms and conditions must be accepted</li>
                  </ul>
                </div>
              </Alert>
            ) : (
              <Button onClick={() => setShowErrorAlert(true)} className="mb-4" variant="destructive">
                Show Form Error Alert
              </Button>
            )}

            <Text className="mb-4 mt-4">Feature Announcement:</Text>
            <Alert
              variant="info"
              title="New Feature Available"
              bordered
              className="mb-4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              <div>
                <Text className="mb-2">
                  We've just launched our new dashboard feature! Now you can visualize your data in real-time.
                </Text>
                <Button size="sm" variant="outline-primary" className="mt-2">
                  Try it now
                </Button>
              </div>
            </Alert>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Alert
<Alert variant="info">
  This is a basic info alert.
</Alert>

// Alert with Title and Icon
<Alert
  variant="success"
  title="Success"
  icon={<SuccessIcon />}
>
  Your profile has been updated successfully.
</Alert>

// Dismissible Alert
<Alert
  variant="warning"
  title="Warning"
  dismissible
  onDismiss={() => console.log("Alert dismissed")}
>
  Your session will expire in 5 minutes.
</Alert>

// Bordered Alert with Custom Content
<Alert variant="info" bordered>
  <div>
    <Text weight="semibold" className="mb-2">
      New Feature Available
    </Text>
    <Text className="mb-2">
      We've just launched our new dashboard feature!
    </Text>
    <Button size="sm" variant="outline-primary">
      Try it now
    </Button>
  </div>
</Alert>`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Tooltip Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Tooltip Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Tooltip component displays informative text when users hover over an element. It's useful for
              providing additional context or explanations.
            </Text>

            <div className="flex justify-center mb-8">
              <Tooltip content="This is a basic tooltip">
                <Button>Hover Me</Button>
              </Tooltip>
            </div>

            <Heading level={3} className="mb-4">
              Tooltip Positions
            </Heading>
            <Text className="mb-4">
              Tooltips can be positioned in four directions: top, bottom, left, and right. The default position is top.
            </Text>

            <Flex gap={8} className="mb-8 justify-center flex-wrap">
              <Tooltip content="Tooltip on top" position="top">
                <Button>Top</Button>
              </Tooltip>

              <Tooltip content="Tooltip on bottom" position="bottom">
                <Button>Bottom</Button>
              </Tooltip>

              <Tooltip content="Tooltip on left" position="left">
                <Button>Left</Button>
              </Tooltip>

              <Tooltip content="Tooltip on right" position="right">
                <Button>Right</Button>
              </Tooltip>
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Tooltip Variants
            </Heading>
            <Text className="mb-4">
              Tooltips come in three variants: dark, light, and primary. The default variant is dark.
            </Text>

            <Flex gap={8} className="mb-8 justify-center">
              <Tooltip content="Dark tooltip (default)" variant="dark">
                <Button>Dark</Button>
              </Tooltip>

              <Tooltip content="Light tooltip" variant="light">
                <Button>Light</Button>
              </Tooltip>

              <Tooltip content="Primary tooltip" variant="primary">
                <Button>Primary</Button>
              </Tooltip>
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Rich Content Tooltips
            </Heading>
            <Text className="mb-4">
              Tooltips can contain rich content, including formatted text, icons, and other elements.
            </Text>

            <div className="flex justify-center mb-8">
              <Tooltip
                content={
                  <div className="p-1">
                    <Text weight="semibold" className="mb-1">
                      Rich Tooltip
                    </Text>
                    <Text size="sm">
                      This tooltip contains formatted text and can include other elements like icons or badges.
                    </Text>
                    <Badge variant="success" className="mt-2">
                      New Feature
                    </Badge>
                  </div>
                }
                position="top"
              >
                <Button>Hover for Rich Content</Button>
              </Tooltip>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">Form Field Help:</Text>
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <label htmlFor="password" className="mr-2">
                  Password:
                </label>
                <Tooltip
                  content="Password must be at least 8 characters and include a number, a lowercase letter, an uppercase letter, and a special character."
                  position="right"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500"
                  >
                    <path
                      d="M12 16v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Tooltip>
              </div>
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
                placeholder="Enter password"
              />
            </div>

            <Text className="mb-4">Feature Explanation:</Text>
            <div className="flex justify-center mb-8">
              <Tooltip
                content={
                  <div className="p-1">
                    <Text weight="semibold" className="mb-1">
                      Dark Mode
                    </Text>
                    <Text size="sm">
                      Switch to dark mode to reduce eye strain in low-light environments and save battery on OLED
                      displays.
                    </Text>
                  </div>
                }
                position="bottom"
              >
                <Button variant="outline" withIcon>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Dark Mode
                </Button>
              </Tooltip>
            </div>

            <Text className="mb-4">Disabled Button Explanation:</Text>
            <div className="flex justify-center mb-8">
              <Tooltip content="You need admin privileges to perform this action">
                <span>
                  <Button disabled>Delete Item</Button>
                </span>
              </Tooltip>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Tooltip
<Tooltip content="This is a basic tooltip">
  <Button>Hover Me</Button>
</Tooltip>

// Positioned Tooltip
<Tooltip content="Tooltip on right" position="right">
  <Button>Right</Button>
</Tooltip>

// Variant Tooltip
<Tooltip content="Primary tooltip" variant="primary">
  <Button>Primary</Button>
</Tooltip>

// Rich Content Tooltip
<Tooltip
  content={
    <div className="p-1">
      <Text weight="semibold" className="mb-1">
        Rich Tooltip
      </Text>
      <Text size="sm">
        This tooltip contains formatted text.
      </Text>
      <Badge variant="success" className="mt-2">
        New Feature
      </Badge>
    </div>
  }
  position="top"
>
  <Button>Hover for Rich Content</Button>
</Tooltip>

// Form Field Help Tooltip
<div className="flex items-center">
  <label htmlFor="password" className="mr-2">
    Password:
  </label>
  <Tooltip
    content="Password must be at least 8 characters..."
    position="right"
  >
    <InfoIcon className="text-gray-500" />
  </Tooltip>
</div>`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Accordion Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Accordion Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Accordion component displays collapsible content panels. It's useful for organizing content into
              sections that can be expanded or collapsed.
            </Text>

            <Accordion className="mb-8">
              <AccordionItem title="What is an accordion?">
                <Text>
                  An accordion is a UI component that displays collapsible content panels. It allows users to show and
                  hide sections of related content on a page.
                </Text>
              </AccordionItem>
              <AccordionItem title="When to use accordions?">
                <Text>
                  Use accordions when you want to display a large amount of content in a limited space. They're
                  particularly useful for FAQs, product details, and settings pages.
                </Text>
              </AccordionItem>
              <AccordionItem title="Accessibility considerations">
                <Text>
                  Accordions are built with accessibility in mind. They use proper ARIA attributes and can be navigated
                  using a keyboard.
                </Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Accordion Variants
            </Heading>
            <Text className="mb-4">
              Accordions come in three variants: default, bordered, and filled. The default variant has minimal styling.
            </Text>

            <Text className="mb-2">Bordered Variant:</Text>
            <Accordion variant="bordered" className="mb-4">
              <AccordionItem title="Bordered Accordion Item 1">
                <Text>
                  This is a bordered accordion item. The border helps to visually separate the accordion items from each
                  other.
                </Text>
              </AccordionItem>
              <AccordionItem title="Bordered Accordion Item 2">
                <Text>This is another bordered accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Text className="mb-2">Filled Variant:</Text>
            <Accordion variant="filled" className="mb-8">
              <AccordionItem title="Filled Accordion Item 1">
                <Text>
                  This is a filled accordion item. The background color helps to visually separate the accordion items
                  from each other.
                </Text>
              </AccordionItem>
              <AccordionItem title="Filled Accordion Item 2">
                <Text>This is another filled accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Accordion Colors
            </Heading>
            <Text className="mb-4">
              Accordions can have different color schemes. The default color scheme is neutral, but you can also use the
              primary color scheme.
            </Text>

            <Accordion color="primary" variant="filled" className="mb-8">
              <AccordionItem title="Primary Accordion Item 1">
                <Text>
                  This is a primary colored accordion item. The primary color scheme uses your brand's primary color.
                </Text>
              </AccordionItem>
              <AccordionItem title="Primary Accordion Item 2">
                <Text>This is another primary colored accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Multiple Open Items
            </Heading>
            <Text className="mb-4">
              By default, only one accordion item can be open at a time. You can allow multiple items to be open
              simultaneously by using the allowMultiple prop.
            </Text>

            <Accordion allowMultiple className="mb-8">
              <AccordionItem title="Multiple Item 1">
                <Text>
                  This accordion allows multiple items to be open at once. Try opening this while the other items are
                  open.
                </Text>
              </AccordionItem>
              <AccordionItem title="Multiple Item 2">
                <Text>Try opening this while the other items are open.</Text>
              </AccordionItem>
              <AccordionItem title="Multiple Item 3">
                <Text>You can have all items open at the same time.</Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Rich Content in Accordion Items
            </Heading>
            <Text className="mb-4">
              Accordion items can contain rich content, including formatted text, images, and other components.
            </Text>

            <Accordion className="mb-8">
              <AccordionItem title="Rich Content Example">
                <div>
                  <Heading level={4} className="mb-2">
                    Nested Heading
                  </Heading>
                  <Text className="mb-4">
                    This accordion item contains rich content, including a heading, text, and a button.
                  </Text>
                  <Button>Click Me</Button>
                </div>
              </AccordionItem>
              <AccordionItem title="Form in Accordion">
                <div>
                  <Text className="mb-4">Accordions can contain forms and other interactive elements:</Text>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        placeholder="Enter your email"
                      />
                    </div>
                    <Button>Submit</Button>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">FAQ Section:</Text>
            <Accordion variant="bordered" className="mb-8">
              <AccordionItem title="How do I create an account?">
                <Text>
                  To create an account, click on the "Sign Up" button in the top right corner of the page. Fill out the
                  registration form with your name, email address, and password. Then click "Create Account" to complete
                  the process.
                </Text>
              </AccordionItem>
              <AccordionItem title="How do I reset my password?">
                <Text>
                  To reset your password, click on the "Login" button, then click "Forgot Password" below the login
                  form. Enter your email address and click "Send Reset Link". You'll receive an email with instructions
                  to reset your password.
                </Text>
              </AccordionItem>
              <AccordionItem title="How do I cancel my subscription?">
                <Text>
                  To cancel your subscription, go to your Account Settings, then click on the "Subscription" tab. Click
                  "Cancel Subscription" and follow the prompts to confirm the cancellation. You'll receive an email
                  confirming your cancellation.
                </Text>
              </AccordionItem>
            </Accordion>

            <Text className="mb-4">Product Details:</Text>
            <Accordion variant="filled" className="mb-8">
              <AccordionItem title="Product Specifications">
                <div>
                  <Text className="mb-2">
                    <strong>Dimensions:</strong> 10" x 5" x 2"
                  </Text>
                  <Text className="mb-2">
                    <strong>Weight:</strong> 1.5 lbs
                  </Text>
                  <Text className="mb-2">
                    <strong>Material:</strong> Aluminum
                  </Text>
                  <Text className="mb-2">
                    <strong>Color Options:</strong> Silver, Black, Gold
                  </Text>
                  <Text className="mb-2">
                    <strong>Battery Life:</strong> Up to 10 hours
                  </Text>
                </div>
              </AccordionItem>
              <AccordionItem title="Shipping Information">
                <div>
                  <Text className="mb-2">
                    <strong>Processing Time:</strong> 1-2 business days
                  </Text>
                  <Text className="mb-2">
                    <strong>Shipping Methods:</strong>
                  </Text>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Standard Shipping (5-7 business days): $5.99</li>
                    <li>Expedited Shipping (2-3 business days): $12.99</li>
                    <li>Next Day Shipping (1 business day): $24.99</li>
                  </ul>
                  <Text>Free standard shipping on orders over $50!</Text>
                </div>
              </AccordionItem>
              <AccordionItem title="Return Policy">
                <Text>
                  We offer a 30-day return policy for all products. Items must be returned in their original packaging
                  and in new, unused condition. Return shipping costs are the responsibility of the customer unless the
                  return is due to a defect or error on our part.
                </Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Accordion
<Accordion>
  <AccordionItem title="Section 1">
    <Text>Content for section 1</Text>
  </AccordionItem>
  <AccordionItem title="Section 2">
    <Text>Content for section 2</Text>
  </AccordionItem>
</Accordion>

// Bordered Variant
<Accordion variant="bordered">
  <AccordionItem title="Bordered Item 1">
    <Text>Content for bordered item 1</Text>
  </AccordionItem>
  <AccordionItem title="Bordered Item 2">
    <Text>Content for bordered item 2</Text>
  </AccordionItem>
</Accordion>

// Filled Variant with Primary Color
<Accordion variant="filled" color="primary">
  <AccordionItem title="Primary Item 1">
    <Text>Content for primary item 1</Text>
  </AccordionItem>
  <AccordionItem title="Primary Item 2">
    <Text>Content for primary item 2</Text>
  </AccordionItem>
</Accordion>

// Multiple Open Items
<Accordion allowMultiple>
  <AccordionItem title="Multiple Item 1">
    <Text>Content for multiple item 1</Text>
  </AccordionItem>
  <AccordionItem title="Multiple Item 2">
    <Text>Content for multiple item 2</Text>
  </AccordionItem>
</Accordion>

// Rich Content Example
<Accordion>
  <AccordionItem title="Rich Content Example">
    <div>
      <Heading level={4} className="mb-2">
        Nested Heading
      </Heading>
      <Text className="mb-4">
        This accordion item contains rich content.
      </Text>
      <Button>Click Me</Button>
    </div>
  </AccordionItem>
</Accordion>`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Tabs Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Tabs Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Tabs component organizes content into separate views that share the same space on the screen. It's
              useful for switching between different sections of content.
            </Text>

            <Tabs className="mb-8">
              <Tab label="Tab 1">
                <div className="p-4">
                  <Heading level={4} className="mb-2">
                    Tab 1 Content
                  </Heading>
                  <Text>
                    This is the content for Tab 1. You can put any content here, including text, images, and other
                    components.
                  </Text>
                </div>
              </Tab>
              <Tab label="Tab 2">
                <div className="p-4">
                  <Heading level={4} className="mb-2">
                    Tab 2 Content
                  </Heading>
                  <Text>
                    This is the content for Tab 2. Each tab can have different content, allowing you to organize related
                    information into separate views.
                  </Text>
                </div>
              </Tab>
              <Tab label="Tab 3">
                <div className="p-4">
                  <Heading level={4} className="mb-2">
                    Tab 3 Content
                  </Heading>
                  <Text>
                    This is the content for Tab 3. Tabs are great for organizing content into categories without taking
                    up too much space on the screen.
                  </Text>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Tab Variants
            </Heading>
            <Text className="mb-4">
              Tabs come in three variants: default, boxed, and pills. The default variant has minimal styling.
            </Text>

            <Text className="mb-2">Boxed Variant:</Text>
            <Tabs variant="boxed" className="mb-8">
              <Tab label="Boxed Tab 1">
                <div className="p-4">
                  <Text>
                    This is a boxed tab variant. Boxed tabs have a border around the active tab, making it look like a
                    box.
                  </Text>
                </div>
              </Tab>
              <Tab label="Boxed Tab 2">
                <div className="p-4">
                  <Text>This is the content for Boxed Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Text className="mb-2">Pills Variant:</Text>
            <Tabs variant="pills" className="mb-8">
              <Tab label="Pills Tab 1">
                <div className="p-4">
                  <Text>
                    This is a pills tab variant. Pills tabs have rounded corners, making them look like pills or
                    buttons.
                  </Text>
                </div>
              </Tab>
              <Tab label="Pills Tab 2">
                <div className="p-4">
                  <Text>This is the content for Pills Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Tab Sizes
            </Heading>
            <Text className="mb-4">
              Tabs come in three sizes: small (sm), medium (md), and large (lg). The default size is medium.
            </Text>

            <Text className="mb-2">Small Size:</Text>
            <Tabs size="sm" className="mb-4">
              <Tab label="Small Tab 1">
                <div className="p-4">
                  <Text>This is a small-sized tab. Small tabs take up less space.</Text>
                </div>
              </Tab>
              <Tab label="Small Tab 2">
                <div className="p-4">
                  <Text>This is the content for Small Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Text className="mb-2">Large Size:</Text>
            <Tabs size="lg" className="mb-8">
              <Tab label="Large Tab 1">
                <div className="p-4">
                  <Text>This is a large-sized tab. Large tabs are more prominent.</Text>
                </div>
              </Tab>
              <Tab label="Large Tab 2">
                <div className="p-4">
                  <Text>This is the content for Large Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Tab Alignments
            </Heading>
            <Text className="mb-4">
              Tabs can be aligned in four ways: start, center, end, and stretch. The default alignment is start.
            </Text>

            <Text className="mb-2">Center Alignment:</Text>
            <Tabs align="center" className="mb-4">
              <Tab label="Centered Tab 1">
                <div className="p-4">
                  <Text>These tabs are centered. Center alignment is good for balanced layouts.</Text>
                </div>
              </Tab>
              <Tab label="Centered Tab 2">
                <div className="p-4">
                  <Text>This is the content for Centered Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Text className="mb-2">Stretch Alignment:</Text>
            <Tabs align="stretch" className="mb-8">
              <Tab label="Stretched Tab 1">
                <div className="p-4">
                  <Text>These tabs stretch to fill the available space. Stretched tabs have equal widths.</Text>
                </div>
              </Tab>
              <Tab label="Stretched Tab 2">
                <div className="p-4">
                  <Text>This is the content for Stretched Tab 2.</Text>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Controlled Tabs
            </Heading>
            <Text className="mb-4">
              You can control which tab is active by using the activeTab and onTabChange props. This is useful when you
              need to programmatically change the active tab.
            </Text>

            <div className="mb-8">
              <div className="mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setActiveTab(0)}
                  disabled={activeTab === 0}
                >
                  Activate Tab 1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setActiveTab(1)}
                  disabled={activeTab === 1}
                >
                  Activate Tab 2
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab(2)} disabled={activeTab === 2}>
                  Activate Tab 3
                </Button>
              </div>

              <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
                <Tab label="Controlled Tab 1">
                  <div className="p-4">
                    <Text>
                      This is a controlled tab. The active tab is controlled by the activeTab prop, which is currently
                      set to {activeTab}.
                    </Text>
                  </div>
                </Tab>
                <Tab label="Controlled Tab 2">
                  <div className="p-4">
                    <Text>
                      This is the content for Controlled Tab 2. Click the buttons above to change the active tab.
                    </Text>
                  </div>
                </Tab>
                <Tab label="Controlled Tab 3">
                  <div className="p-4">
                    <Text>
                      This is the content for Controlled Tab 3. The onTabChange prop is called when a tab is clicked.
                    </Text>
                  </div>
                </Tab>
              </Tabs>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Disabled Tabs
            </Heading>
            <Text className="mb-4">
              You can disable individual tabs by using the disabled prop on the Tab component. Disabled tabs cannot be
              clicked.
            </Text>

            <Tabs className="mb-8">
              <Tab label="Active Tab">
                <div className="p-4">
                  <Text>This is an active tab that can be clicked.</Text>
                </div>
              </Tab>
              <Tab label="Disabled Tab" disabled>
                <div className="p-4">
                  <Text>This tab is disabled and cannot be clicked.</Text>
                </div>
              </Tab>
              <Tab label="Another Active Tab">
                <div className="p-4">
                  <Text>This is another active tab that can be clicked.</Text>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">User Profile Tabs:</Text>
            <Tabs variant="boxed" className="mb-8">
              <Tab label="Profile Information">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <Avatar src="/professional-headshot.jpg" alt="John Doe" size="lg" className="mr-4" />
                    <div>
                      <Heading level={4} className="mb-1">
                        John Doe
                      </Heading>
                      <Text size="sm" color="muted">
                        Software Engineer
                      </Text>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Text weight="semibold">Email:</Text>
                      <Text>john.doe@example.com</Text>
                    </div>
                    <div>
                      <Text weight="semibold">Location:</Text>
                      <Text>San Francisco, CA</Text>
                    </div>
                    <div>
                      <Text weight="semibold">Member Since:</Text>
                      <Text>January 2022</Text>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab label="Account Settings">
                <div className="p-4">
                  <Heading level={4} className="mb-4">
                    Account Settings
                  </Heading>
                  <div className="space-y-4">
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Email Notifications
                      </Text>
                      <div className="flex items-center">
                        <input type="checkbox" id="email-notifications" className="mr-2" />
                        <label htmlFor="email-notifications">Receive email notifications</label>
                      </div>
                    </div>
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Two-Factor Authentication
                      </Text>
                      <div className="flex items-center">
                        <input type="checkbox" id="two-factor" className="mr-2" />
                        <label htmlFor="two-factor">Enable two-factor authentication</label>
                      </div>
                    </div>
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Language
                      </Text>
                      <select className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab label="Billing">
                <div className="p-4">
                  <Heading level={4} className="mb-4">
                    Billing Information
                  </Heading>
                  <div className="space-y-4">
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Current Plan
                      </Text>
                      <Text>Pro Plan - $19.99/month</Text>
                    </div>
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Next Billing Date
                      </Text>
                      <Text>June 15, 2023</Text>
                    </div>
                    <div>
                      <Text weight="semibold" className="mb-1">
                        Payment Method
                      </Text>
                      <Text>Visa ending in 4242</Text>
                    </div>
                    <Button variant="outline">Update Payment Method</Button>
                  </div>
                </div>
              </Tab>
            </Tabs>

            <Text className="mb-4">Product Details Tabs:</Text>
            <Tabs variant="pills" className="mb-8">
              <Tab label="Description">
                <div className="p-4">
                  <Text>
                    The XYZ Wireless Headphones deliver exceptional sound quality with deep bass and crystal-clear
                    highs. The comfortable over-ear design and soft ear cushions make them perfect for extended
                    listening sessions. With up to 30 hours of battery life, you can enjoy your music all day long
                    without worrying about recharging.
                  </Text>
                </div>
              </Tab>
              <Tab label="Specifications">
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Driver Size:
                      </Text>
                      <Text>40mm</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Frequency Response:
                      </Text>
                      <Text>20Hz - 20kHz</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Impedance:
                      </Text>
                      <Text>32 Ohms</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Battery Life:
                      </Text>
                      <Text>Up to 30 hours</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Charging Time:
                      </Text>
                      <Text>2 hours</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Bluetooth Version:
                      </Text>
                      <Text>5.0</Text>
                    </div>
                    <div className="flex">
                      <Text weight="semibold" className="w-40">
                        Weight:
                      </Text>
                      <Text>250g</Text>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab label="Reviews">
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="text-yellow-400 flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <Text weight="semibold">Amazing Sound Quality</Text>
                      </div>
                      <Text size="sm" color="muted" className="mb-1">
                        By John D. on May 10, 2023
                      </Text>
                      <Text>
                        These headphones have incredible sound quality. The bass is deep and the highs are crystal
                        clear. I'm very impressed with the overall sound performance.
                      </Text>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="text-yellow-400 flex mr-2">
                          {[1, 2, 3, 4].map((star) => (
                            <svg
                              key={star}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <Text weight="semibold">Comfortable but a bit heavy</Text>
                      </div>
                      <Text size="sm" color="muted" className="mb-1">
                        By Sarah M. on April 28, 2023
                      </Text>
                      <Text>
                        The ear cushions are very comfortable, but the headphones are a bit heavy for extended use. The
                        sound quality is great though, so I still recommend them.
                      </Text>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Tabs
<Tabs>
  <Tab label="Tab 1">
    <div className="p-4">
      <Text>Content for Tab 1</Text>
    </div>
  </Tab>
  <Tab label="Tab 2">
    <div className="p-4">
      <Text>Content for Tab 2</Text>
    </div>
  </Tab>
</Tabs>

// Boxed Variant
<Tabs variant="boxed">
  <Tab label="Boxed Tab 1">
    <div className="p-4">
      <Text>Content for Boxed Tab 1</Text>
    </div>
  </Tab>
  <Tab label="Boxed Tab 2">
    <div className="p-4">
      <Text>Content for Boxed Tab 2</Text>
    </div>
  </Tab>
</Tabs>

// Pills Variant
<Tabs variant="pills">
  <Tab label="Pills Tab 1">
    <div className="p-4">
      <Text>Content for Pills Tab 1</Text>
    </div>
  </Tab>
  <Tab label="Pills Tab 2">
    <div className="p-4">
      <Text>Content for Pills Tab 2</Text>
    </div>
  </Tab>
</Tabs>

// Controlled Tabs
const [activeTab, setActiveTab] = useState(0);

<Tabs activeTab={activeTab} onTabChange={setActiveTab}>
  <Tab label="Controlled Tab 1">
    <div className="p-4">
      <Text>Content for Controlled Tab 1</Text>
    </div>
  </Tab>
  <Tab label="Controlled Tab 2">
    <div className="p-4">
      <Text>Content for Controlled Tab 2</Text>
    </div>
  </Tab>
</Tabs>

// Disabled Tab
<Tabs>
  <Tab label="Active Tab">
    <div className="p-4">
      <Text>Content for Active Tab</Text>
    </div>
  </Tab>
  <Tab label="Disabled Tab" disabled>
    <div className="p-4">
      <Text>Content for Disabled Tab</Text>
    </div>
  </Tab>
</Tabs>`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Avatar Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Avatar Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Avatar component displays a user's profile image or their initials as a fallback. It's useful for
              representing users in interfaces.
            </Text>

            <div className="flex justify-center mb-8">
              <Avatar src="/professional-headshot.jpg" alt="John Doe" size="lg" />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Avatar Sizes
            </Heading>
            <Text className="mb-4">
              Avatars come in six sizes: extra small (xs), small (sm), medium (md), large (lg), extra large (xl), and
              double extra large (xxl). The default size is medium.
            </Text>

            <Flex gap={4} className="mb-8 items-center justify-center">
              <Avatar size="xs" alt="User" />
              <Avatar size="sm" alt="User" />
              <Avatar size="md" alt="User" />
              <Avatar size="lg" alt="User" />
              <Avatar size="xl" alt="User" />
              <Avatar size="xxl" alt="User" />
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Avatar Shapes
            </Heading>
            <Text className="mb-4">
              Avatars come in three shapes: circle, square, and rounded. The default shape is circle.
            </Text>

            <Flex gap={4} className="mb-8 items-center justify-center">
              <Avatar shape="circle" alt="User" size="lg" />
              <Avatar shape="square" alt="User" size="lg" />
              <Avatar shape="rounded" alt="User" size="lg" />
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Avatar with Image
            </Heading>
            <Text className="mb-4">
              Avatars can display an image by using the src prop. If the image fails to load, the avatar will display a
              fallback.
            </Text>

            <Flex gap={4} className="mb-8 items-center justify-center">
              <Avatar src="/professional-headshot.jpg" alt="John Doe" size="lg" />
              <Avatar src="/broken-image-url.jpg" alt="Jane Smith" size="lg" fallback="JS" />
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Avatar with Status
            </Heading>
            <Text className="mb-4">
              Avatars can display a status indicator by using the status prop. The status can be online, offline, busy,
              or away.
            </Text>

            <Flex gap={4} className="mb-8 items-center justify-center">
              <Avatar alt="User" status="online" size="lg" />
              <Avatar alt="User" status="offline" size="lg" />
              <Avatar alt="User" status="busy" size="lg" />
              <Avatar alt="User" status="away" size="lg" />
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Avatar Group
            </Heading>
            <Text className="mb-4">
              The AvatarGroup component displays a group of avatars with an optional limit. If there are more avatars
              than the limit, the remaining count is displayed.
            </Text>

            <div className="flex justify-center mb-8">
              <AvatarGroup max={3}>
                <Avatar src="/professional-headshot.jpg" alt="User 1" />
                <Avatar alt="User 2" fallback="U2" />
                <Avatar alt="User 3" fallback="U3" />
                <Avatar alt="User 4" fallback="U4" />
                <Avatar alt="User 5" fallback="U5" />
              </AvatarGroup>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Custom Fallback Content
            </Heading>
            <Text className="mb-4">
              You can customize the fallback content that appears when an image fails to load by using the fallback
              prop.
            </Text>

            <Flex gap={4} className="mb-8 items-center justify-center">
              <Avatar alt="John Doe" fallback="JD" size="lg" />
              <Avatar
                alt="User"
                size="lg"
                fallback={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </Flex>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">User Profile:</Text>
            <div className="flex items-center mb-8 justify-center">
              <Avatar src="/professional-headshot.jpg" alt="John Doe" size="xl" className="mr-4" />
              <div>
                <Heading level={4} className="mb-1">
                  John Doe
                </Heading>
                <Text size="sm" color="muted" className="mb-1">
                  Software Engineer
                </Text>
                <Badge variant="primary">Pro User</Badge>
              </div>
            </div>

            <Text className="mb-4">Comment Section:</Text>
            <div className="space-y-4 mb-8">
              <div className="flex">
                <Avatar src="/professional-headshot.jpg" alt="John Doe" className="mr-3" />
                <div>
                  <div className="flex items-center mb-1">
                    <Text weight="semibold" className="mr-2">
                      John Doe
                    </Text>
                    <Text size="xs" color="muted">
                      2 hours ago
                    </Text>
                  </div>
                  <Text className="mb-2">
                    This is a great article! I learned a lot about design systems and how to implement them in my
                    projects.
                  </Text>
                  <div className="flex items-center">
                    <button className="text-sm text-gray-500 mr-4">Like</button>
                    <button className="text-sm text-gray-500">Reply</button>
                  </div>
                </div>
              </div>
              <div className="flex">
                <Avatar alt="Jane Smith" fallback="JS" className="mr-3" />
                <div>
                  <div className="flex items-center mb-1">
                    <Text weight="semibold" className="mr-2">
                      Jane Smith
                    </Text>
                    <Text size="xs" color="muted">
                      1 hour ago
                    </Text>
                  </div>
                  <Text className="mb-2">
                    I agree! The examples are very helpful and easy to understand. I'll definitely be using these
                    components in my next project.
                  </Text>
                  <div className="flex items-center">
                    <button className="text-sm text-gray-500 mr-4">Like</button>
                    <button className="text-sm text-gray-500">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <Text className="mb-4">Team Members:</Text>
            <div className="mb-8">
              <Text weight="semibold" className="mb-2">
                Project Team
              </Text>
              <AvatarGroup>
                <Avatar src="/professional-headshot.jpg" alt="John Doe" />
                <Avatar alt="Jane Smith" fallback="JS" />
                <Avatar alt="Bob Johnson" fallback="BJ" />
                <Avatar alt="Alice Williams" fallback="AW" />
              </AvatarGroup>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Avatar
<Avatar src="/path/to/image.jpg" alt="User Name" />

// Avatar with Size and Shape
<Avatar 
  src="/path/to/image.jpg" 
  alt="User Name" 
  size="lg" 
  shape="rounded" 
/>

// Avatar with Fallback
<Avatar 
  src="/broken-image-url.jpg" 
  alt="Jane Smith" 
  fallback="JS" 
/>

// Avatar with Status
<Avatar 
  src="/path/to/image.jpg" 
  alt="User Name" 
  status="online" 
/>

// Avatar Group
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar alt="User 3" fallback="U3" />
  <Avatar alt="User 4" fallback="U4" />
  <Avatar alt="User 5" fallback="U5" />
</AvatarGroup>

// Custom Fallback Content
<Avatar 
  alt="User" 
  fallback={<UserIcon />} 
/>

// User Profile Example
<div className="flex items-center">
  <Avatar src="/user.jpg" alt="John Doe" size="xl" className="mr-4" />
  <div>
    <Heading level={4} className="mb-1">John Doe</Heading>
    <Text size="sm" color="muted">Software Engineer</Text>
  </div>
</div>`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Pagination Component Documentation */}
        <Card className="mb-12">
          <CardHeader>
            <Heading level={2}>Pagination Component</Heading>
          </CardHeader>
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Usage
            </Heading>
            <Text className="mb-4">
              The Pagination component helps users navigate through multi-page content. It displays page numbers and
              navigation controls.
            </Text>

            <div className="flex justify-center mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Pagination Variants
            </Heading>
            <Text className="mb-4">
              Pagination comes in three variants: default, rounded, and outline. The default variant has minimal
              styling.
            </Text>

            <Text className="mb-2">Rounded Variant:</Text>
            <div className="flex justify-center mb-4">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} variant="rounded" />
            </div>

            <Text className="mb-2">Outline Variant:</Text>
            <div className="flex justify-center mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} variant="outline" />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Pagination Sizes
            </Heading>
            <Text className="mb-4">
              Pagination comes in three sizes: small (sm), medium (md), and large (lg). The default size is medium.
            </Text>

            <Text className="mb-2">Small Size:</Text>
            <div className="flex justify-center mb-4">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} size="sm" />
            </div>

            <Text className="mb-2">Large Size:</Text>
            <div className="flex justify-center mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} size="lg" />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Pagination with Few Pages
            </Heading>
            <Text className="mb-4">When there are few pages, all page numbers are displayed without ellipses.</Text>

            <div className="flex justify-center mb-8">
              <Pagination
                totalPages={5}
                currentPage={currentPage > 5 ? 1 : currentPage}
                onPageChange={(page) => setCurrentPage(page > 5 ? 1 : page)}
              />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Pagination with Many Pages
            </Heading>
            <Text className="mb-4">
              When there are many pages, ellipses are used to represent skipped page numbers. You can control how many
              sibling pages are shown on each side of the current page using the siblingCount prop.
            </Text>

            <Text className="mb-2">Default Sibling Count (1):</Text>
            <div className="flex justify-center mb-4">
              <Pagination
                totalPages={20}
                currentPage={currentPage > 20 ? 1 : currentPage}
                onPageChange={(page) => setCurrentPage(page > 20 ? 1 : page)}
              />
            </div>

            <Text className="mb-2">Increased Sibling Count (2):</Text>
            <div className="flex justify-center mb-8">
              <Pagination
                totalPages={20}
                currentPage={currentPage > 20 ? 1 : currentPage}
                onPageChange={(page) => setCurrentPage(page > 20 ? 1 : page)}
                siblingCount={2}
              />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Pagination without Controls
            </Heading>
            <Text className="mb-4">
              You can hide the previous and next buttons by setting the showControls prop to false.
            </Text>

            <div className="flex justify-center mb-8">
              <Pagination
                totalPages={10}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                showControls={false}
              />
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Real-World Examples
            </Heading>

            <Text className="mb-4">Blog Posts Pagination:</Text>
            <div className="mb-8">
              <div className="space-y-4 mb-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <Heading level={4} className="mb-2">
                    Getting Started with Design Systems
                  </Heading>
                  <Text className="mb-2">
                    Learn how to create and implement a design system for your web applications...
                  </Text>
                  <div className="flex items-center">
                    <Avatar size="sm" alt="John Doe" className="mr-2" />
                    <Text size="sm" color="muted">
                      John Doe • May 15, 2023
                    </Text>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <Heading level={4} className="mb-2">
                    The Power of CSS Modules
                  </Heading>
                  <Text className="mb-2">
                    Discover how CSS Modules can help you write more maintainable and scalable CSS...
                  </Text>
                  <div className="flex items-center">
                    <Avatar size="sm" alt="Jane Smith" fallback="JS" className="mr-2" />
                    <Text size="sm" color="muted">
                      Jane Smith • May 10, 2023
                    </Text>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <Heading level={4} className="mb-2">
                    Building Accessible Components
                  </Heading>
                  <Text className="mb-2">
                    Learn how to create components that are accessible to all users, including those with
                    disabilities...
                  </Text>
                  <div className="flex items-center">
                    <Avatar size="sm" alt="Bob Johnson" fallback="BJ" className="mr-2" />
                    <Text size="sm" color="muted">
                      Bob Johnson • May 5, 2023
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} />
              </div>
            </div>

            <Text className="mb-4">Data Table Pagination:</Text>
            <div className="mb-8">
              <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2">John Doe</td>
                      <td className="px-4 py-2">john.doe@example.com</td>
                      <td className="px-4 py-2">Admin</td>
                      <td className="px-4 py-2">
                        <Badge variant="success">Active</Badge>
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2">Jane Smith</td>
                      <td className="px-4 py-2">jane.smith@example.com</td>
                      <td className="px-4 py-2">Editor</td>
                      <td className="px-4 py-2">
                        <Badge variant="success">Active</Badge>
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2">Bob Johnson</td>
                      <td className="px-4 py-2">bob.johnson@example.com</td>
                      <td className="px-4 py-2">User</td>
                      <td className="px-4 py-2">
                        <Badge variant="warning">Pending</Badge>
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2">Alice Williams</td>
                      <td className="px-4 py-2">alice.williams@example.com</td>
                      <td className="px-4 py-2">User</td>
                      <td className="px-4 py-2">
                        <Badge variant="error">Inactive</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center">
                <Text size="sm" color="muted">
                  Showing 1-4 of 20 items
                </Text>
                <Pagination totalPages={5} currentPage={currentPage} onPageChange={setCurrentPage} size="sm" />
              </div>
            </div>

            <Heading level={3} className="mb-4 mt-8">
              Code Example
            </Heading>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
              <pre className="text-sm">
                {`// Basic Pagination
const [currentPage, setCurrentPage] = useState(1);

<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
/>

// Rounded Variant
<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  variant="rounded" 
/>

// Outline Variant
<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  variant="outline" 
/>

// Small Size
<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  size="sm" 
/>

// Large Size
<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  size="lg" 
/>

// Increased Sibling Count
<Pagination 
  totalPages={20} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  siblingCount={2} 
/>

// Without Controls
<Pagination 
  totalPages={10} 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
  showControls={false} 
/>

// Blog Posts Pagination Example
<div>
  {/* Blog posts */}
  <div className="space-y-4 mb-4">
    {posts.map(post => (
      <BlogPostCard key={post.id} post={post} />
    ))}
  </div>
  
  {/* Pagination */}
  <div className="flex justify-center">
    <Pagination 
      totalPages={totalPages} 
      currentPage={currentPage} 
      onPageChange={setCurrentPage} 
    />
  </div>
</div>

// Data Table Pagination Example
<div>
  {/* Data table */}
  <table className="w-full">
    {/* Table content */}
  </table>
  
  {/* Pagination with item count */}
  <div className="flex justify-between items-center">
    <Text size="sm" color="muted">
      Showing {startItem}-{endItem} of {totalItems} items
    </Text>
    <Pagination 
      totalPages={totalPages} 
      currentPage={currentPage} 
      onPageChange={setCurrentPage} 
      size="sm" 
    />
  </div>
</div>`}
              </pre>
            </div>
          </CardBody>
        </Card>
      </Section>
    </Container>
  )
}
