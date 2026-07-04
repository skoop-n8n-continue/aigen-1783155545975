const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldJump = `<svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M13.5,5.5C13.5,6.33 12.83,7 12,7C11.17,7 10.5,6.33 10.5,5.5C10.5,4.67 11.17,4 12,4C12.83,4 13.5,4.67 13.5,5.5M9.8,8.9L7,23H9.1L10.5,15L11.8,19H15.8L15.3,17H13.4L11.5,10.6L12,10.5C13.5,10.5 15,11.4 16,12.7L17.4,11.2C16,9.4 13.9,8.5 11.8,8.5L9.8,8.9Z" />
                    </svg>`;

const newJump = `<svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                        <path d="M14 6C14 7.1 13.1 8 12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4C13.1 4 14 4.9 14 6M11.4 16L9.4 22L7.6 21.4L9.2 16.4L6 14.5V11H7.8L10 12.5V8.5C10 7.7 10.6 7 11.4 7H12.6C13.4 7 14 7.7 14 8.5V13H18V14.8H14V11H12.5L11.4 16Z" />
                    </svg>`;

const oldShoot = `<svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
                    </svg>`;

const newShoot = `<svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                        <path d="M22,12L18,8V11H10V13H18V16L22,12M6.5,10C7.33,10 8,10.67 8,11.5V14.5C8,15.33 7.33,16 6.5,16H3.5C2.67,16 2,15.33 2,14.5V11.5C2,10.67 2.67,10 3.5,10H6.5Z" />
                    </svg>`;

html = html.replace(oldJump, newJump).replace(oldShoot, newShoot);
fs.writeFileSync('index.html', html);
console.log('Icons updated');
