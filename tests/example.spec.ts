import { test, expect } from '@playwright/test';
import { Login } from '../Objects/Login.spec';
// import { beforeEach } from 'node:test';

const username = "standard_user" //const/let
const password = "secret_sauce"
const wrongPassword = "wrong_password"

//ham login thanh cong
async function loginSuccessfully(page){
  const rightLogin = new Login(page)
  await rightLogin.fillLogin(username, password)

  await expect(page.locator('.app_logo')).toHaveText('Swag Labs')
}
let page
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
});

test.describe('Login', () => {
  // test.beforeEach(async({page})=>{
  // await page.goto('https://www.saucedemo.com/');
  // })
  //Login sai Username/Password
  test('Login unsuccessfully', async () => {

    const wrongLogin = new Login(page)
    await wrongLogin.fillLogin(username, wrongPassword)

    // Expect display went press wrong password
    await expect(page.locator('h3')).toHaveText('Epic sadface: Username and password do not match any user in this service')

    await page.waitForTimeout(1500)
    await page.locator('.error-button').click()

    await page.waitForTimeout(500)
    await wrongLogin.clearLogin()
  });
  //Login successfully
  test('Login successfully', async()=>{
    await loginSuccessfully(page)
  })
})

let listHamburgerExpect = ["All Items","About","Logout", "Reset App State"]

test.describe('Hambuger button', () => {
  test.beforeEach(async({page})=>{
    await page.goto('https://www.saucedemo.com/');
    await loginSuccessfully(page)
    })
  test.afterEach('Quite browser', async ({page}) =>{
    await page.close()
  })
  test('Check Visible and Hidden', async ({page})=>{
    //1. kiem tra an/hien cua button hamburger
    const buttonHamBueger = page.locator('#react-burger-menu-btn')
    const buttonClose = page.locator('#react-burger-cross-btn')
    await expect(buttonHamBueger).toBeVisible()
    await buttonHamBueger.click()
    // await expect(buttonHamBueger.isVisible()).toBe(true)

    await expect(buttonClose).toBeVisible()
    //hover vao tung item
    let listHamburgerActual =  await page.locator('.bm-item')
    for (let i = 0; i < await listHamburgerActual.count(); i++){
      const initialColor = await listHamburgerActual.nth(i).evaluate(element => {
        return window.getComputedStyle(element).color;
      });
      console.log('init color:'+ initialColor)
      await listHamburgerActual.nth(i).hover()
      const hoverColor = await listHamburgerActual.nth(i).evaluate(element => {
        return window.getComputedStyle(element).color;
      });
      console.log('Hover Color: ', hoverColor);
      await page.waitForTimeout(1500)
      const actualText = await listHamburgerActual.nth(i).textContent();
      await expect(actualText).toBe(listHamburgerExpect[i]);
      // await expect(listHamburgerActual.nth(i).textContent(await listHamburgerExpect.first().textcontent())
    }
    console.log("aaaaa: " + await listHamburgerActual.count())
    await buttonClose.click()

  })
})

test.describe('Dropdown List', () => {

  test.beforeEach(async({page})=>{
    await page.goto('https://www.saucedemo.com/');
    await loginSuccessfully(page)
    })
    test.afterEach('Quite browser', async ({page}) =>{
      await page.close()
    })
  test('Verify dropdown list is present', async({page})=>{
    const dropdownList = await page.locator('.product_sort_container')
    await expect(dropdownList).toBeVisible()
    // await expect(dropdownList.isVisible()).toBe(true)
  })

  test('Verify default selected value', async({page})=>{
    const dropdownList = await page.locator('.active_option')
    const selectedValue = await dropdownList.textContent()
    await expect(selectedValue).toBe('Name (A to Z)')
  })

  test('Verify dropdown expands on click and all options are present', async({page})=>{
    const dropdownList = await page.locator('.product_sort_container')
    await dropdownList.click()
    // const optionActuals = await page.locator('.product_sort_container').allTextContents()
    const optionActuals = await page.$$eval('.product_sort_container option', options => 
      options.map(option => option.textContent)
    );

    const optionExpected = ["Name (A to Z)", "Name (Z to A)", "Price (low to high)", "Price (high to low)"]
    console.log(optionActuals)
    console.log(optionExpected)
    let str = "['Name (A to Z)Name (Z to A)Price (low to high)Price (high to low)']";

    await expect(optionActuals).toEqual(optionExpected)
    // loan commit 1
    // loan commit 2
    // loan commit 3, 3.5
  })
})
