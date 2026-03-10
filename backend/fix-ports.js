const fs = require('fs');
const files = [
  '../frontend/src/pages/Students.jsx',
  '../frontend/src/pages/Profile.jsx',
  '../frontend/src/pages/Login.jsx',
  '../frontend/src/pages/Register.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/localhost:5000/g, 'localhost:5001');
  fs.writeFileSync(f, content);
});
console.log('Ports updated.');
