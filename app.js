var finder = require('congressional-district-finder');
const csvParser = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const stateDistrictsList = {
  'AL': ['AL-1', 'AL-2', 'AL-3', 'AL-4', 'AL-5', 'AL-6', 'AL-7'],
  'AZ': ['AZ-1', 'AZ-2', 'AZ-3', 'AZ-4', 'AZ-5', 'AZ-6', 'AZ-7', 'AZ-8', 'AZ-9'],
  'AR': ['AR-1', 'AR-2', 'AR-3', 'AR-4'],
  'CA': ['CA-1', 'CA-2', 'CA-3', 'CA-4', 'CA-5', 'CA-6', 'CA-7', 'CA-8', 'CA-9', 'CA-10', 'CA-11', 'CA-12', 'CA-13', 'CA-14', 'CA-15', 'CA-16', 'CA-17', 'CA-18', 'CA-19', 'CA-20', 'CA-21', 'CA-22', 'CA-23', 'CA-24', 'CA-25', 'CA-26', 'CA-27', 'CA-28', 'CA-29', 'CA-30', 'CA-31', 'CA-32', 'CA-33', 'CA-34', 'CA-35', 'CA-36', 'CA-37', 'CA-38', 'CA-39', 'CA-40', 'CA-41', 'CA-42', 'CA-43', 'CA-44', 'CA-45', 'CA-46', 'CA-47', 'CA-48', 'CA-49', 'CA-50', 'CA-51', 'CA-52', 'CA-53'],
  'CO': ['CO-1', 'CO-2', 'CO-3', 'CO-4', 'CO-5', 'CO-6', 'CO-7'],
  'CT': ['CT-1', 'CT-2', 'CT-3', 'CT-4', 'CT-5'],
  'FL': ['FL-1', 'FL-2', 'FL-3', 'FL-4', 'FL-5', 'FL-6', 'FL-7', 'FL-8', 'FL-9', 'FL-10', 'FL-11', 'FL-12', 'FL-13', 'FL-14', 'FL-15', 'FL-16', 'FL-17', 'FL-18', 'FL-19', 'FL-20', 'FL-21', 'FL-22', 'FL-23', 'FL-24', 'FL-25', 'FL-26', 'FL-27'],
  'GA': ['GA-1', 'GA-2', 'GA-3', 'GA-4', 'GA-5', 'GA-6', 'GA-7', 'GA-8', 'GA-9', 'GA-10', 'GA-11', 'GA-12', 'GA-13', 'GA-14'],
  'HI': ['HI-1', 'HI-2'],
  'ID': ['ID-1', 'ID-2'],
  'IL': ['IL-1', 'IL-2', 'IL-3', 'IL-4', 'IL-5', 'IL-6', 'IL-7', 'IL-8', 'IL-9', 'IL-10', 'IL-11', 'IL-12', 'IL-13', 'IL-14', 'IL-15', 'IL-16', 'IL-17', 'IL-18'],
  'IN': ['IN-1', 'IN-2', 'IN-3', 'IN-4', 'IN-5', 'IN-6', 'IN-7', 'IN-8', 'IN-9'],
  'IA': ['IA-1', 'IA-2', 'IA-3', 'IA-4'],
  'KS': ['KS-1', 'KS-2', 'KS-3', 'KS-4'],
  'KY': ['KY-1', 'KY-2', 'KY-3', 'KY-4', 'KY-5', 'KY-6'],
  'LA': ['LA-1', 'LA-2', 'LA-3', 'LA-4', 'LA-5', 'LA-6'],
  'ME': ['ME-1', 'ME-2'],
  'MD': ['MD-1', 'MD-2', 'MD-3', 'MD-4', 'MD-5', 'MD-6', 'MD-7', 'MD-8'],
  'MA': ['MA-1', 'MA-2', 'MA-3', 'MA-4', 'MA-5', 'MA-6', 'MA-7', 'MA-8', 'MA-9'],
  'MI': ['MI-1', 'MI-2', 'MI-3', 'MI-4', 'MI-5', 'MI-6', 'MI-7', 'MI-8', 'MI-9', 'MI-10', 'MI-11', 'MI-12', 'MI-13', 'MI-14'],
  'MN': ['MN-1', 'MN-2', 'MN-3', 'MN-4', 'MN-5', 'MN-6', 'MN-7', 'MN-8'],
  'MS': ['MS-1', 'MS-2', 'MS-3', 'MS-4'],
  'MO': ['MO-1', 'MO-2', 'MO-3', 'MO-4', 'MO-5', 'MO-6', 'MO-7', 'MO-8'],
  'NE': ['NE-1', 'NE-2', 'NE-3'],
  'NV': ['NV-1', 'NV-2', 'NV-3', 'NV-4'],
  'NH': ['NH-1', 'NH-2'],
  'NJ': ['NJ-1', 'NJ-2', 'NJ-3', 'NJ-4', 'NJ-5', 'NJ-6', 'NJ-7', 'NJ-8', 'NJ-9', 'NJ-10', 'NJ-11', 'NJ-12'],
  'NM': ['NM-1', 'NM-2', 'NM-3'],
  'NY': ['NY-1', 'NY-2', 'NY-3', 'NY-4', 'NY-5', 'NY-6', 'NY-7', 'NY-8', 'NY-9', 'NY-10', 'NY-11', 'NY-12', 'NY-13', 'NY-14', 'NY-15', 'NY-16', 'NY-17', 'NY-18', 'NY-19', 'NY-20', 'NY-21', 'NY-22', 'NY-23', 'NY-24', 'NY-25', 'NY-26', 'NY-27', 'NY-28', 'NY-29', 'NY-30', 'NY-31', 'NY-32', 'NY-33', 'NY-34', 'NY-35', 'NY-36', 'NY-37', 'NY-38', 'NY-39', 'NY-40', 'NY-41', 'NY-42', 'NY-43', 'NY-44', 'NY-45'],
  'OH': ['OH-1', 'OH-2', 'OH-3', 'OH-4', 'OH-5', 'OH-6', 'OH-7', 'OH-8', 'OH-9', 'OH-10', 'OH-11', 'OH-12', 'OH-13', 'OH-14', 'OH-15', 'OH-16'],
  'OK': ['OK-1', 'OK-2', 'OK-3', 'OK-4', 'OK-5'],
  'OR': ['OR-1', 'OR-2', 'OR-3', 'OR-4', 'OR-5'],
  'PA': ['PA-1', 'PA-2', 'PA-3', 'PA-4', 'PA-5', 'PA-6', 'PA-7', 'PA-8', 'PA-9', 'PA-10', 'PA-11', 'PA-12', 'PA-13', 'PA-14', 'PA-15', 'PA-16', 'PA-17', 'PA-18'],
  'RI': ['RI-1', 'RI-2'],
  'SC': ['SC-1', 'SC-2', 'SC-3', 'SC-4', 'SC-5', 'SC-6', 'SC-7'],
  'TN': ['TN-1', 'TN-2', 'TN-3', 'TN-4', 'TN-5', 'TN-6', 'TN-7', 'TN-8', 'TN-9'],
  'TX': ['TX-1', 'TX-2', 'TX-3', 'TX-4', 'TX-5', 'TX-6', 'TX-7', 'TX-8', 'TX-9', 'TX-10', 'TX-11', 'TX-12', 'TX-13', 'TX-14', 'TX-15', 'TX-16', 'TX-17', 'TX-18', 'TX-19', 'TX-20', 'TX-21', 'TX-22', 'TX-23', 'TX-24', 'TX-25', 'TX-26', 'TX-27', 'TX-28', 'TX-29', 'TX-30', 'TX-31', 'TX-32', 'TX-33', 'TX-34', 'TX-35', 'TX-36'],
  'UT': ['UT-1', 'UT-2', 'UT-3', 'UT-4'],
  'VA': ['VA-1', 'VA-2', 'VA-3', 'VA-4', 'VA-5', 'VA-6', 'VA-7', 'VA-8', 'VA-9', 'VA-10', 'VA-11', 'VA-12'],
  'WA': ['WA-1', 'WA-2', 'WA-3', 'WA-4', 'WA-5', 'WA-6', 'WA-7', 'WA-8', 'WA-9'],
  'WV': ['WV-1', 'WV-2', 'WV-3'],
  'WI': ['WI-1', 'WI-2', 'WI-3', 'WI-4', 'WI-5', 'WI-6', 'WI-7', 'WI-8'],
};

async function geopointToDistrict (geopoint, state) {
  if (geopoint === undefined) {
    console.log('Invalid Zip Code');
    return 'Invalid Zip Code';
  } else {
    const geoSplit = geopoint.split(',')
    const latitude = geoSplit[0];
    const longitude = geoSplit[1];
    var matchFlag = 'No Match';
    districts = stateDistrictsList[state];
    if (districts !== undefined) {
      var j;
      for (j = 0; (j < districts.length) && (matchFlag == 'No Match'); j++) {
        matchFlag = await finder.checkLatLngInDistrict(latitude, longitude, districts[j])
        .then(function (result) {
          if (result.isMatched) {
            console.log('Found a match');
            return result.district.districtCode;
          } else {
            return 'No Match';
          }
        })
        .catch(function (err) {
          return 'No Match';
        });
      }
    }
    return matchFlag;
  }
}

async function zipCodeToDistrict () {
  const zipGeopoint = [];
  const MoCData = [];
  const zipCodeFile = fs.createReadStream('./data/us-zip-code-latitude-and-longitude.csv');
  const MoCSignUpsFile = fs.createReadStream('./data/test data.csv');
  zipCodeFile.pipe(csvParser({ separator: ';' }))
    .on('data', (row) => {
      const { Zip, geopoint } = row;
      zipGeopoint[Zip] = geopoint;
    })
    .on('end', async () => {
      MoCSignUpsFile.pipe(csvParser())
      .on('data', (row) => {
        const { Email } = row;
        const zipCode = row['Zip/Postal Code'];
        const state = row['State/Province'];
        const name = row['﻿First Name'] + ' ' + row['Last Name'];
        console.log([name, Email, zipCode, state]);
        MoCData.push([name, Email, zipCode, state]);
      })
      .on('end', async () => {
        var i;
        for (i = 0; i < MoCData.length; i++) {
          const state = MoCData[i][3];
          const zipCode = MoCData[i][2];
          MoCData[i].push(await geopointToDistrict(zipGeopoint[zipCode], state));
        }
        const csvWriter = createCsvWriter({
          header: ['Name', 'Email', 'Zip Code', 'State', 'District'],
          path: './data/output.csv'
        });
        csvWriter.writeRecords(MoCData)
          .then(() => {
              console.log('...Done');
          });
      });
    });
}

zipCodeToDistrict();

