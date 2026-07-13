"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { i18n } from "@lingui/core"
const Account = () => {
  return (
    <div className="flex  justify-center  gap-6 ">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">{i18n.t({ id: "ui.Account", message: "Account" })}</TabsTrigger>
          <TabsTrigger value="password">{i18n.t({ id: "ui.Password", message: "Password" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{i18n.t({ id: "ui.Account", message: "Account" })}</CardTitle>
              <CardDescription>
                {i18n.t({ id: "ui.Make changes to your account here.Click save when you're done.", message: " Make changes to your account here. Click save when you&apos;redone." })}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">{i18n.t({ id: "ui.Name", message: "Name" })}</Label>
                <Input id="tabs-demo-name" placeholder={i18n.t({ id: "input.Name", message: "Name" })} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">{i18n.t({ id: "ui.Username", message: "Username" })}</Label>
                <Input id="tabs-demo-username" placeholder={i18n.t({ id: "input.Username", message: "Username" })} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>{i18n.t({ id: "ui.Save Changes", message: "Save Changes" })}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{i18n.t({ id: "ui.Password", message: "Password" })}</CardTitle>
              <CardDescription>
                {i18n.t({ id: "ui.Change your password here. After saving, you&apos;ll be logged out.", message: " Change your password here. After saving, you&apos;ll be logged out." })}

              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">{i18n.t({ id: "ui.Current Password", message: " Current Password" })}</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">{i18n.t({ id: "ui.New Password", message: " New Password" })}</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>{i18n.t({ id: "ui.Save Password", message: " Save Password" })}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default Account;