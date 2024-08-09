import {Page} from '@playwright/test'

export class Login {
    readonly page: Page
    constructor (page: Page){
        this.page = page
    }
    async fillLogin(userName: string, password: string){
        await this.page.locator('#user-name').pressSequentially(userName, {delay: 100})
        await this.page.locator('#password').pressSequentially(password, {delay: 100})
        await this.page.locator('#login-button').click()
    }

    async clearLogin(){
        await this.page.locator('#user-name').clear({force: true})
        await this.page.locator('#password').clear({force: true})
    }
}