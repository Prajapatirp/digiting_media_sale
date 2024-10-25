export const validationMessages = {
  required: (fieldName: string) =>
    `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } is required.`,
  format: (fieldName: string) => ` ${fieldName} should be in correct format.`,
  passwordLength: (fieldName: string, minLength: number) =>
    `${fieldName} must be at least ${minLength} characters.`,
  contactLength: (fieldName: string, minLength: number) =>
    `${fieldName} should be ${minLength} digit.`,
  passwordComplexity: (fieldName: string) =>
    `${fieldName} must be an uppercase lowercase number and special characters.`,
  passwordsMatch: (fieldName: string) => `${fieldName} must match.`,
  phoneNumber: (fieldName: string) =>
    `Invalid ${fieldName.toLowerCase()} format.`,
  notSameAsField: (fieldName: string, comparedField: string) =>
    `${fieldName} must be different from ${comparedField}.`,
  maxLength: (fieldName: string, maxLength: number | string) =>
    `${fieldName} must be at ${maxLength} characters.`,
  minLength: (fieldName: string, minLength: number | string) =>
    `${fieldName} must be at ${minLength} numbers.`,
  positiveNumber: (fieldName: string) =>
    `${fieldName} must be positive`,
  greaterThan: (fieldName: string, parent: string) =>
    `${fieldName} must be greater than ${parent}`,
};

export const projectTitle = 'Building Management';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/;
export const numberRegex = /^\d{10}$/;
export const zipcodeRegex = /^\d{6}$/;
export const positiveNumberRegex = /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;


export const handleResponse = {
  dataNotFound: "Sorry! No Result Found.",
  nullData: "---",
  somethingWrong: "Something went wrong.",
};

export const searchPlaceHolder = "Search...";

export const roleEnums = {
  Admin: "Admin",
  Vendor: "Vendor",
  Manager: "Manager",
  SuperAdmin: "Super Admin",
  Dealer: 'Dealer',
  Employee: "Employee"
}

export const tableButtons = {
  Previous: "Previous",
  Next: "Next"
}

export const handleEditClick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
};

export const dayEnums = {
  GoodMorning : 'Good Morning',
  GoodAfternoon : 'Good Afternoon',
  GoodEvening : 'Good Evening',
};

export const noData = '-'

export const dashboard = 'Dashboard'
export const stock = 'Stock'
export const stockReport = 'Stock Report'
export const taskAllocation = 'Task Allocation'
export const expanse = 'Expense'
export const expanseReport = 'Expense Report'
export const service = 'Item'
export const employee = 'Employee'
export const project = 'Project'
export const deal = 'Deal'
export const stockType = 'Material Procurement'
export const stackHolder = 'Dealers'
export const report = 'Report'
export const dpr = 'DPR'
export const master = 'Master'
export const inquiry = 'Inquiry'
export const contactus = 'Contact Us'
export const partnerWithUs = 'PartnerWith Us'
export const ChannelPartnerr = 'Channel Partner'
export const Redevelopmentt = 'Redevelopment'