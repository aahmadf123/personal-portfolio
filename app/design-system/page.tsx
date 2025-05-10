"use client"

import React from "react"
import {
  Container,
  Section,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormSwitch,
  Grid,
  Flex,
  FormRow,
  FormCol,
  Alert,
  Tooltip,
  Accordion,
  AccordionItem,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Pagination,
} from "@/components/design-system"

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <Container>
      <Section>
        <Heading level={1} align="center">
          Design System
        </Heading>
        <Text align="center" size="lg" className="mt-4 mb-12">
          A comprehensive design system built with CSS Modules
        </Text>

        {/* Typography */}
        <Heading level={2} className="mb-6">
          Typography
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={1} className="mb-4">
              Heading 1
            </Heading>
            <Heading level={2} className="mb-4">
              Heading 2
            </Heading>
            <Heading level={3} className="mb-4">
              Heading 3
            </Heading>
            <Heading level={4} className="mb-4">
              Heading 4
            </Heading>
            <Heading level={5} className="mb-4">
              Heading 5
            </Heading>
            <Heading level={6} className="mb-8">
              Heading 6
            </Heading>

            <Text size="2xl" className="mb-2">
              Text 2XL
            </Text>
            <Text size="xl" className="mb-2">
              Text XL
            </Text>
            <Text size="lg" className="mb-2">
              Text LG
            </Text>
            <Text size="base" className="mb-2">
              Text Base
            </Text>
            <Text size="sm" className="mb-2">
              Text SM
            </Text>
            <Text size="xs" className="mb-6">
              Text XS
            </Text>

            <Text weight="bold" className="mb-2">
              Bold Text
            </Text>
            <Text weight="semibold" className="mb-2">
              Semibold Text
            </Text>
            <Text weight="medium" className="mb-2">
              Medium Text
            </Text>
            <Text weight="normal" className="mb-2">
              Normal Text
            </Text>
            <Text weight="light" className="mb-6">
              Light Text
            </Text>

            <Text color="primary" className="mb-2">
              Primary Text
            </Text>
            <Text color="secondary" className="mb-2">
              Secondary Text
            </Text>
            <Text color="tertiary" className="mb-2">
              Tertiary Text
            </Text>
            <Text color="accent" className="mb-2">
              Accent Text
            </Text>
            <Text color="muted" className="mb-2">
              Muted Text
            </Text>
          </CardBody>
        </Card>

        {/* Buttons */}
        <Heading level={2} className="mb-6">
          Buttons
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Button Variants
            </Heading>
            <Flex gap={4} className="mb-8 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="outline-primary">Outline Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghost-primary">Ghost Primary</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </Flex>

            <Heading level={3} className="mb-4">
              Button Sizes
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Flex>

            <Heading level={3} className="mb-4">
              Button States
            </Heading>
            <Flex gap={4} className="mb-8 flex-wrap">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </Flex>

            <Heading level={3} className="mb-4">
              Button with Icon
            </Heading>
            <Flex gap={4} className="mb-8 flex-wrap">
              <Button withIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add Item
              </Button>
              <Button withIcon iconPosition="right">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button iconOnly aria-label="Add item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Flex>

            <Heading level={3} className="mb-4">
              Button with Ripple Effect
            </Heading>
            <Flex gap={4} className="mb-4">
              <Button ripple>Click Me</Button>
              <Button variant="secondary" ripple>
                Click Me
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Cards */}
        <Heading level={2} className="mb-6">
          Cards
        </Heading>
        <Grid cols={1} mdCols={3} gap={6} className="mb-12">
          <Card>
            <CardHeader>
              <Heading level={4}>Basic Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>This is a basic card with header, body, and footer.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="primary" shadow="md">
            <CardHeader>
              <Heading level={4}>Primary Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>This is a primary card with a medium shadow.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="primary">
                Action
              </Button>
            </CardFooter>
          </Card>

          <Card hover interactive>
            <CardHeader>
              <Heading level={4}>Interactive Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>This card has hover and interactive states.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Action
              </Button>
            </CardFooter>
          </Card>
        </Grid>

        {/* Badges */}
        <Heading level={2} className="mb-6">
          Badges
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Badge Variants
            </Heading>
            <Flex gap={4} className="mb-8 flex-wrap">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="tertiary">Tertiary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </Flex>

            <Heading level={3} className="mb-4">
              Badge Sizes
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </Flex>

            <Heading level={3} className="mb-4">
              Outline Badges
            </Heading>
            <Flex gap={4} className="mb-8 flex-wrap">
              <Badge variant="primary" outline>
                Primary
              </Badge>
              <Badge variant="secondary" outline>
                Secondary
              </Badge>
              <Badge variant="success" outline>
                Success
              </Badge>
              <Badge variant="error" outline>
                Error
              </Badge>
            </Flex>

            <Heading level={3} className="mb-4">
              Badge with Icon
            </Heading>
            <Flex gap={4} className="mb-4">
              <Badge withIcon>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Verified
              </Badge>
              <Badge variant="error" withIcon>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Error
              </Badge>
            </Flex>
          </CardBody>
        </Card>

        {/* Alerts */}
        <Heading level={2} className="mb-6">
          Alerts
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Alert Variants
            </Heading>
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
              This is an information alert with an icon.
            </Alert>

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
              This is a success alert with an icon.
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
              This is a warning alert with an icon.
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
              This is an error alert with an icon.
            </Alert>

            <Heading level={3} className="mb-4 mt-6">
              Alert Sizes
            </Heading>
            <Alert variant="info" size="sm" className="mb-4">
              This is a small alert.
            </Alert>

            <Alert variant="info" size="md" className="mb-4">
              This is a medium alert.
            </Alert>

            <Alert variant="info" size="lg" className="mb-4">
              This is a large alert.
            </Alert>

            <Heading level={3} className="mb-4 mt-6">
              Dismissible Alert
            </Heading>
            <Alert variant="info" dismissible className="mb-4" onDismiss={() => console.log("Alert dismissed")}>
              This is a dismissible alert. Click the X to dismiss it.
            </Alert>

            <Heading level={3} className="mb-4 mt-6">
              Bordered Alert
            </Heading>
            <Alert variant="info" bordered className="mb-4">
              This is a bordered alert.
            </Alert>
          </CardBody>
        </Card>

        {/* Tooltips */}
        <Heading level={2} className="mb-6">
          Tooltips
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Tooltip Positions
            </Heading>
            <Flex gap={8} className="mb-8 justify-center">
              <Tooltip content="Top tooltip" position="top">
                <Button>Top</Button>
              </Tooltip>

              <Tooltip content="Bottom tooltip" position="bottom">
                <Button>Bottom</Button>
              </Tooltip>

              <Tooltip content="Left tooltip" position="left">
                <Button>Left</Button>
              </Tooltip>

              <Tooltip content="Right tooltip" position="right">
                <Button>Right</Button>
              </Tooltip>
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Tooltip Variants
            </Heading>
            <Flex gap={8} className="mb-8 justify-center">
              <Tooltip content="Dark tooltip" variant="dark">
                <Button>Dark</Button>
              </Tooltip>

              <Tooltip content="Light tooltip" variant="light">
                <Button>Light</Button>
              </Tooltip>

              <Tooltip content="Primary tooltip" variant="primary">
                <Button>Primary</Button>
              </Tooltip>
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Tooltip with Rich Content
            </Heading>
            <div className="flex justify-center">
              <Tooltip
                content={
                  <div className="p-1">
                    <Text weight="semibold" className="mb-1">
                      Rich Tooltip
                    </Text>
                    <Text size="sm">This tooltip has rich content with multiple lines of text and styling.</Text>
                  </div>
                }
                position="top"
              >
                <Button>Hover Me</Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>

        {/* Accordion */}
        <Heading level={2} className="mb-6">
          Accordion
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Accordion
            </Heading>
            <Accordion className="mb-8">
              <AccordionItem title="What is a design system?">
                <Text>
                  A design system is a collection of reusable components, guided by clear standards, that can be
                  assembled to build any number of applications.
                </Text>
              </AccordionItem>
              <AccordionItem title="Why use CSS Modules?">
                <Text>
                  CSS Modules provide local scoping of CSS by automatically creating unique class names, which helps
                  prevent style conflicts and makes styles more maintainable.
                </Text>
              </AccordionItem>
              <AccordionItem title="How to use this design system?">
                <Text>
                  Import the components you need from the design system and use them in your application. You can
                  customize them using the provided props or by adding additional className props.
                </Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-6">
              Accordion Variants
            </Heading>
            <Accordion variant="bordered" className="mb-8">
              <AccordionItem title="Bordered Accordion Item 1">
                <Text>This is a bordered accordion item.</Text>
              </AccordionItem>
              <AccordionItem title="Bordered Accordion Item 2">
                <Text>This is another bordered accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Accordion variant="filled" className="mb-8">
              <AccordionItem title="Filled Accordion Item 1">
                <Text>This is a filled accordion item.</Text>
              </AccordionItem>
              <AccordionItem title="Filled Accordion Item 2">
                <Text>This is another filled accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-6">
              Accordion Colors
            </Heading>
            <Accordion color="primary" variant="filled" className="mb-8">
              <AccordionItem title="Primary Accordion Item 1">
                <Text>This is a primary colored accordion item.</Text>
              </AccordionItem>
              <AccordionItem title="Primary Accordion Item 2">
                <Text>This is another primary colored accordion item.</Text>
              </AccordionItem>
            </Accordion>

            <Heading level={3} className="mb-4 mt-6">
              Multiple Open Items
            </Heading>
            <Accordion allowMultiple className="mb-4">
              <AccordionItem title="Multiple Item 1">
                <Text>This accordion allows multiple items to be open at once.</Text>
              </AccordionItem>
              <AccordionItem title="Multiple Item 2">
                <Text>Try opening this while the other item is open.</Text>
              </AccordionItem>
              <AccordionItem title="Multiple Item 3">
                <Text>You can have all items open at the same time.</Text>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>

        {/* Tabs */}
        <Heading level={2} className="mb-6">
          Tabs
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Tabs
            </Heading>
            <Tabs className="mb-8">
              <Tab label="Tab 1">
                <Text>This is the content for Tab 1. You can put any content here, including other components.</Text>
              </Tab>
              <Tab label="Tab 2">
                <Text>This is the content for Tab 2. Each tab can have different content.</Text>
              </Tab>
              <Tab label="Tab 3">
                <Text>This is the content for Tab 3. Tabs are great for organizing content into categories.</Text>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-6">
              Tab Variants
            </Heading>
            <Tabs variant="boxed" className="mb-8">
              <Tab label="Boxed Tab 1">
                <Text>This is a boxed tab variant.</Text>
              </Tab>
              <Tab label="Boxed Tab 2">
                <Text>Boxed tabs have a different visual style.</Text>
              </Tab>
            </Tabs>

            <Tabs variant="pills" className="mb-8">
              <Tab label="Pills Tab 1">
                <Text>This is a pills tab variant.</Text>
              </Tab>
              <Tab label="Pills Tab 2">
                <Text>Pills tabs have a rounded appearance.</Text>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-6">
              Tab Sizes
            </Heading>
            <Tabs size="sm" className="mb-4">
              <Tab label="Small Tab 1">
                <Text>This is a small-sized tab.</Text>
              </Tab>
              <Tab label="Small Tab 2">
                <Text>Small tabs take up less space.</Text>
              </Tab>
            </Tabs>

            <Tabs size="lg" className="mb-8">
              <Tab label="Large Tab 1">
                <Text>This is a large-sized tab.</Text>
              </Tab>
              <Tab label="Large Tab 2">
                <Text>Large tabs are more prominent.</Text>
              </Tab>
            </Tabs>

            <Heading level={3} className="mb-4 mt-6">
              Tab Alignments
            </Heading>
            <Tabs align="center" className="mb-4">
              <Tab label="Centered Tab 1">
                <Text>These tabs are centered.</Text>
              </Tab>
              <Tab label="Centered Tab 2">
                <Text>Center alignment is good for balanced layouts.</Text>
              </Tab>
            </Tabs>

            <Tabs align="stretch" className="mb-8">
              <Tab label="Stretched Tab 1">
                <Text>These tabs stretch to fill the available space.</Text>
              </Tab>
              <Tab label="Stretched Tab 2">
                <Text>Stretched tabs have equal widths.</Text>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Avatars */}
        <Heading level={2} className="mb-6">
          Avatars
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Avatar Sizes
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Avatar size="xs" alt="User" />
              <Avatar size="sm" alt="User" />
              <Avatar size="md" alt="User" />
              <Avatar size="lg" alt="User" />
              <Avatar size="xl" alt="User" />
              <Avatar size="xxl" alt="User" />
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Avatar Shapes
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Avatar shape="circle" alt="User" />
              <Avatar shape="square" alt="User" />
              <Avatar shape="rounded" alt="User" />
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Avatar with Image
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Avatar src="/professional-headshot.jpg" alt="John Doe" size="lg" />
              <Avatar src="/broken-image-url.jpg" alt="Jane Smith" size="lg" fallback="JS" />
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Avatar with Status
            </Heading>
            <Flex gap={4} className="mb-8 items-center">
              <Avatar alt="User" status="online" />
              <Avatar alt="User" status="offline" />
              <Avatar alt="User" status="busy" />
              <Avatar alt="User" status="away" />
            </Flex>

            <Heading level={3} className="mb-4 mt-6">
              Avatar Group
            </Heading>
            <AvatarGroup max={3}>
              <Avatar src="/professional-headshot.jpg" alt="User 1" />
              <Avatar alt="User 2" fallback="U2" />
              <Avatar alt="User 3" fallback="U3" />
              <Avatar alt="User 4" fallback="U4" />
              <Avatar alt="User 5" fallback="U5" />
            </AvatarGroup>
          </CardBody>
        </Card>

        {/* Pagination */}
        <Heading level={2} className="mb-6">
          Pagination
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <Heading level={3} className="mb-4">
              Basic Pagination
            </Heading>
            <div className="mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>

            <Heading level={3} className="mb-4 mt-6">
              Pagination Variants
            </Heading>
            <div className="mb-4">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} variant="rounded" />
            </div>
            <div className="mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} variant="outline" />
            </div>

            <Heading level={3} className="mb-4 mt-6">
              Pagination Sizes
            </Heading>
            <div className="mb-4">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} size="sm" />
            </div>
            <div className="mb-8">
              <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} size="lg" />
            </div>

            <Heading level={3} className="mb-4 mt-6">
              Pagination with Few Pages
            </Heading>
            <div className="mb-4">
              <Pagination
                totalPages={5}
                currentPage={currentPage > 5 ? 1 : currentPage}
                onPageChange={(page) => setCurrentPage(page > 5 ? 1 : page)}
              />
            </div>

            <Heading level={3} className="mb-4 mt-6">
              Pagination with Many Pages
            </Heading>
            <div className="mb-4">
              <Pagination
                totalPages={20}
                currentPage={currentPage > 20 ? 1 : currentPage}
                onPageChange={(page) => setCurrentPage(page > 20 ? 1 : page)}
                siblingCount={2}
              />
            </div>
          </CardBody>
        </Card>

        {/* Forms */}
        <Heading level={2} className="mb-6">
          Forms
        </Heading>
        <Card className="mb-12">
          <CardBody>
            <FormGroup>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput id="name" placeholder="Enter your name" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <FormInput
                id="email"
                type="email"
                placeholder="Enter your email"
                error
                errorText="Please enter a valid email address"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput
                id="password"
                type="password"
                placeholder="Enter your password"
                helperText="Password must be at least 8 characters"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea id="message" placeholder="Enter your message" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="country">Country</FormLabel>
              <FormSelect
                id="country"
                options={[
                  { value: "", label: "Select a country" },
                  { value: "us", label: "United States" },
                  { value: "ca", label: "Canada" },
                  { value: "uk", label: "United Kingdom" },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <FormCheckbox id="terms" label="I agree to the terms and conditions" />
            </FormGroup>

            <FormGroup>
              <FormLabel>Notification Preferences</FormLabel>
              <FormRadio id="email-notifications" name="notifications" label="Email" />
              <FormRadio id="sms-notifications" name="notifications" label="SMS" />
              <FormRadio id="push-notifications" name="notifications" label="Push Notifications" />
            </FormGroup>

            <FormGroup>
              <FormSwitch id="dark-mode" label="Dark Mode" />
            </FormGroup>

            <Heading level={3} className="mb-4 mt-8">
              Form Layout
            </Heading>
            <FormRow>
              <FormCol size="6">
                <FormGroup>
                  <FormLabel htmlFor="first-name">First Name</FormLabel>
                  <FormInput id="first-name" placeholder="First Name" />
                </FormGroup>
              </FormCol>
              <FormCol size="6">
                <FormGroup>
                  <FormLabel htmlFor="last-name">Last Name</FormLabel>
                  <FormInput id="last-name" placeholder="Last Name" />
                </FormGroup>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol size="4">
                <FormGroup>
                  <FormLabel htmlFor="city">City</FormLabel>
                  <FormInput id="city" placeholder="City" />
                </FormGroup>
              </FormCol>
              <FormCol size="4">
                <FormGroup>
                  <FormLabel htmlFor="state">State</FormLabel>
                  <FormInput id="state" placeholder="State" />
                </FormGroup>
              </FormCol>
              <FormCol size="4">
                <FormGroup>
                  <FormLabel htmlFor="zip">Zip Code</FormLabel>
                  <FormInput id="zip" placeholder="Zip Code" />
                </FormGroup>
              </FormCol>
            </FormRow>

            <Button className="mt-4">Submit</Button>
          </CardBody>
        </Card>
      </Section>
    </Container>
  )
}
