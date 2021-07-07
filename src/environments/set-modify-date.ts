import { writeFile } from 'fs';

const targetPath = './src/environments/version.ts';

const versionFile = `export const lastmodify = {
   version: '${new Date().toUTCString()}',  
};`;

writeFile(targetPath, versionFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular version.ts file generated correctly at ${targetPath} \n`);
   }
});