var finder = require('congressional-district-finder');
const csv = require('csv-parser');
const fs = require('fs');

async function districtLookUp (geopoint, state) {
  if (geopoint === undefined) {
    return 'Invalid Zip Code';
  } else {
    const geoSplit = geopoint.split(',')
    const latitude = geoSplit[0];
    const longitude = geoSplit[1];
    const districts = {
      'AZ': ['AZ-1', 'AZ-2', 'AZ-3', 'AZ-4', 'AZ-5', 'AZ-6', 'AZ-7', 'AZ-8', 'AZ-9'],
      'AR': ['AR-1', 'AR-2', 'AR-3', 'AR-4', 'AR-5', 'AR-6', 'AR-7'],
      'CA': ['CA-1', 'CA-2', 'CA-3', 'CA-4', 'CA-5', 'CA-6', 'CA-7', 'CA-8', 'CA-9', 'CA-10', 'CA-11', 'CA-12', 'CA-13', 'CA-14', 'CA-15', 'CA-16', 'CA-17', 'CA-18', 'CA-19', 'CA-20', 'CA-21', 'CA-22', 'CA-23', 'CA-24', 'CA-25', 'CA-26', 'CA-27', 'CA-28', 'CA-29', 'CA-30', 'CA-31', 'CA-32', 'CA-33', 'CA-34', 'CA-35', 'CA-36', 'CA-37', 'CA-38', 'CA-39', 'CA-40', 'CA-41', 'CA-42', 'CA-43', 'CA-44', 'CA-45', 'CA-46', 'CA-47', 'CA-48', 'CA-49', 'CA-50', 'CA-51', 'CA-52', 'CA-53'],
      'CO': ['CO-1', 'CO-2', 'CO-3', 'CO-4', 'CO-5', 'CO-6', 'CO-7'],
      'CT': ['CT-1', 'CT-2', 'CT-3', 'CT-4', 'CT-5', 'CT-6'],
      'FL': ['FL-1', 'FL-2', 'FL-3', 'FL-4', 'FL-5', 'FL-6', 'FL-7', 'FL-8', 'FL-9', 'FL-10', 'FL-11', 'FL-12', 'FL-13', 'FL-14', 'FL-15', 'FL-16', 'FL-17', 'FL-18', 'FL-19', 'FL-20', 'FL-21', 'FL-22', 'FL-23', 'FL-24', 'FL-25', 'FL-26', 'FL-27'],
      'GA': ['GA-1', 'GA-2', 'GA-3', 'GA-4', 'GA-5', 'GA-6', 'GA-7', 'GA-8', 'GA-9', 'GA-10', 'GA-11', 'GA-12', 'GA-13', 'GA-14'],
      'HI': ['HI-1', 'HI-2'],
      'ID': ['ID-1', 'ID-2'],
      'IL': ['IL-1', 'IL-2', 'IL-3', 'IL-4', 'IL-5', 'IL-6', 'IL-7', 'IL-8', 'FL-9', 'FL-10', 'IL-11', 'IL-12', 'IL-13', 'IL-14', 'IL-15', 'IL-16', 'IL-17', 'IL-18', 'IL-19', 'IL-20', 'IL-21', 'IL-22', 'IL-23', 'IL-24', 'IL-25', 'IL-26'],
      'NJ': ['NJ-1', 'NJ-2', 'NJ-3', 'NJ-4', 'NJ-5', 'NJ-6', 'NJ-7', 'NJ-8', 'NJ-9', 'NJ-10', 'NJ-11', 'NJ-12'],
      'MA': ['MA-1', 'MA-2', 'MA-3', 'MA-4', 'MA-5', 'MA-6', 'MA-7', 'MA-8', 'MA-9']
    };
    var temp = undefined;
    var j;
    for (j = 0; (j < districts[state].length) && (temp == undefined || temp == 'No Match'); j++) {
      temp = await finder.checkLatLngInDistrict(latitude, longitude, districts[state][j])
      .then(function (result) {
        if (result.isMatched) {
          console.log('isMatched');
          return result.district.districtCode;
        } else {
          return 'No Match';
        }
      })
      .catch(function (err) {
        return 'District Not Found';
      });
    }
    return temp;
  }
}

async function zipGeopointMap () {
  const zipGeopoint = [];
  const MoCData = [];
  const zipCodeFile = fs.createReadStream('./data/us-zip-code-latitude-and-longitude.csv');
  const MoCSignUpsFile = fs.createReadStream('./data/test data.csv');
  zipCodeFile.pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      const { Zip, geopoint } = row;
      zipGeopoint[Zip] = geopoint;
    })
    .on('end', async () => {
      MoCSignUpsFile.pipe(csv())
      .on('data', (row) => {
        const { Email } = row;
        const zipCode = row['Zip/Postal Code'];
        const state = row['State/Province'];
        const name = row['﻿First Name'] + ' ' + row['Last Name'];
        var district;
        MoCData.push({ name, Email, zipCode, state, district });
      })
      .on('end', async () => {
        var i;
        for (i = 0; i < MoCData.length; i++) {
          const { state, zipCode } = MoCData[i];
          MoCData[i].district = await districtLookUp(zipGeopoint[zipCode], state);
        }
        console.log(MoCData);
      });
    });
}

zipGeopointMap();

