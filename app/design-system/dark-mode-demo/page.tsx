"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/design-system/theme-toggle"
import { Alert } from "@/components/design-system/alert"
import { Tooltip } from "@/components/design-system/tooltip"
import { Accordion, AccordionItem } from "@/components/design-system/accordion"
import { Tabs, Tab } from "@/components/design-system/tabs"
import { Avatar, AvatarGroup } from "@/components/design-system/avatar"
import { Pagination } from "@/components/design-system/pagination"
import { Button } from "@/components/design-system/button"
import { Card, CardHeader, CardBody, CardFooter } from "@/components/design-system/card"
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormSwitch,
} from "@/components/design-system/form"
import { Heading, Text } from "@/components/design-system/typography"

export default function DarkModeDemo() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <Heading level={1}>Dark Mode Support</Heading>
        <ThemeToggle />
      </div>

      <Text className="mb-8">
        Click the theme toggle button in the top right to switch between light, dark, and system themes. All components
        have been updated to support dark mode with appropriate color adjustments.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Heading level={2} className="mb-4">
            Alerts
          </Heading>
          <div className="space-y-4">
            <Alert variant="info" title="Information">
              This is an info alert with dark mode support.
            </Alert>
            <Alert variant="success" title="Success">
              This is a success alert with dark mode support.
            </Alert>
            <Alert variant="warning" title="Warning">
              This is a warning alert with dark mode support.
            </Alert>
            <Alert variant="error" title="Error">
              This is an error alert with dark mode support.
            </Alert>
            <Alert variant="neutral" title="Neutral">
              This is a neutral alert with dark mode support.
            </Alert>
          </div>
        </div>

        <div>
          <Heading level={2} className="mb-4">
            Tooltips
          </Heading>
          <div className="flex flex-wrap gap-4">
            <Tooltip content="Dark tooltip" position="top" variant="dark">
              <Button>Dark</Button>
            </Tooltip>
            <Tooltip content="Light tooltip" position="top" variant="light">
              <Button>Light</Button>
            </Tooltip>
            <Tooltip content="Primary tooltip" position="top" variant="primary">
              <Button>Primary</Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Heading level={2} className="mb-4">
            Accordion
          </Heading>
          <Accordion>
            <AccordionItem title="Section 1">
              <Text>
                This is the content for section 1. The accordion component has been updated to support dark mode.
              </Text>
            </AccordionItem>
            <AccordionItem title="Section 2">
              <Text>
                This is the content for section 2. The accordion component has been updated to support dark mode.
              </Text>
            </AccordionItem>
            <AccordionItem title="Section 3">
              <Text>
                This is the content for section 3. The accordion component has been updated to support dark mode.
              </Text>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <Heading level={2} className="mb-4">
            Tabs
          </Heading>
          <Tabs>
            <Tab label="Tab 1">
              <Text>This is the content for tab 1. The tabs component has been updated to support dark mode.</Text>
            </Tab>
            <Tab label="Tab 2">
              <Text>This is the content for tab 2. The tabs component has been updated to support dark mode.</Text>
            </Tab>
            <Tab label="Tab 3">
              <Text>This is the content for tab 3. The tabs component has been updated to support dark mode.</Text>
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Heading level={2} className="mb-4">
            Avatars
          </Heading>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Avatar size="sm" alt="User 1" />
              <Avatar size="md" alt="User 2" />
              <Avatar size="lg" alt="User 3" />
              <Avatar size="xl" alt="User 4" />
            </div>
            <div>
              <AvatarGroup max={3}>
                <Avatar alt="User 1" />
                <Avatar alt="User 2" />
                <Avatar alt="User 3" />
                <Avatar alt="User 4" />
                <Avatar alt="User 5" />
              </AvatarGroup>
            </div>
            <div className="flex flex-wrap gap-4">
              <Avatar status="online" alt="Online" />
              <Avatar status="offline" alt="Offline" />
              <Avatar status="busy" alt="Busy" />
              <Avatar status="away" alt="Away" />
            </div>
          </div>
        </div>

        <div>
          <Heading level={2} className="mb-4">
            Pagination
          </Heading>
          <div className="space-y-4">
            <Pagination totalPages={5} currentPage={currentPage} onPageChange={setCurrentPage} />
            <Pagination totalPages={5} currentPage={currentPage} onPageChange={setCurrentPage} variant="rounded" />
            <Pagination totalPages={5} currentPage={currentPage} onPageChange={setCurrentPage} variant="outline" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Heading level={2} className="mb-4">
            Buttons
          </Heading>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="accent">Accent</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Outline</Button>
              <Button variant="outline-primary">Outline Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghost-primary">Ghost Primary</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
        </div>

        <div>
          <Heading level={2} className="mb-4">
            Cards
          </Heading>
          <div className="space-y-4">
            <Card>
              <CardHeader>Card Header</CardHeader>
              <CardBody>
                <Text>This is a basic card with dark mode support.</Text>
              </CardBody>
              <CardFooter>Card Footer</CardFooter>
            </Card>
            <div className="flex flex-wrap gap-4">
              <Card variant="primary" className="w-1/3">
                <CardBody>Primary</CardBody>
              </Card>
              <Card variant="secondary" className="w-1/3">
                <CardBody>Secondary</CardBody>
              </Card>
              <Card variant="tertiary" className="w-1/3">
                <CardBody>Tertiary</CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Heading level={2} className="mb-4">
          Forms
        </Heading>
        <Card>
          <CardBody>
            <form className="space-y-4">
              <FormGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput id="name" placeholder="Enter your name" />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput id="email" type="email" placeholder="Enter your email" />
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

              <div className="space-y-2">
                <FormLabel>Preferences</FormLabel>
                <FormCheckbox id="newsletter" label="Subscribe to newsletter" />
                <FormCheckbox id="terms" label="Accept terms and conditions" />
              </div>

              <div className="space-y-2">
                <FormLabel>Contact Method</FormLabel>
                <FormRadio id="contact-email" name="contact" label="Email" />
                <FormRadio id="contact-phone" name="contact" label="Phone" />
              </div>

              <div className="space-y-2">
                <FormSwitch id="notifications" label="Enable notifications" />
                <FormSwitch id="marketing" label="Receive marketing emails" />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="reset">
                  Reset
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
