const cors = require('cors');
var express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
var app = express();

var desktopServerName = "DESKTOP-S8PA8GT\\SQLEXPRESS"
var laptopServerName = "LAPTOP-D4ETF9F5\\SQLEXPRESS"
var searchParams = "";

app.use(express.static('public'));
app.use(cors({origin: "http://localhost:3000"}));

app.get('/rows', (req, res) => {
    const queriedOffset = req.query.offset;
    const queriedRowsPerPage = req.query.rowsPerPage;
    searchParams = "early response";
    const mainQuery = `SELECT doi, paper_name, pH, 		(ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + 		 ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + 		 ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + 		 ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + 		 ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + 		 ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') +		 ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + 		 ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','')		) as salt,		(ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + 		 ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + 		 ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') +		 ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') +		 ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') +		 ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') +		 ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') +		 ISNULL(CAST(ethylene_glycol_percent AS VARCHAR) + ' % ethylene_glycol ','')		) as buffering_agent,		(ISNULL(CAST(CHAPS_percent AS VARCHAR) + ' % CHAPS ','') +		 ISNULL(CAST(glycerol_percent AS VARCHAR) + ' % glycerol ','')		) as detergent,		(ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') +		 ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') +		 ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') +		 ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') + 		 ISNULL(CAST(PNEA_percent AS VARCHAR) + ' % sodium azide ','') +		 ISNULL(CAST(MTG_percent AS VARCHAR) + ' % MTG ','') +		 ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','')		) as additives,		cleaned_text as text_block FROM (	SELECT DISTINCT [doi]		  ,[paper_name]		  ,[pH]		  ,[NaCl]		  ,[Urea]		  ,[Tris]		  ,[Imidazole]		  ,[DTT]		  ,[KCl]		  ,[HEPES]		  ,[CaCl2]		  ,[EGTA]		  ,[TCEP]		  ,[MgCl2]		  ,[MES]		  ,[EDTA]		  ,[NaOAc]		  ,[Na2HPO4]		  ,[KH2PO4]		  ,[PBS]		  ,[GDP]		  ,[glycerol_percent]		  ,[CHAPS_percent]		  ,[PIPES]		  ,[PNEA_percent]		  ,[ethylene_glycol_percent]		  ,[MTG_percent]		  ,[ATP]		  ,[cleaned_text]		  FROM [purificationdb].[dbo].[Mar21DataFrameFlat]) as temp ORDER BY(SELECT NULL) OFFSET ${queriedOffset} ROWS FETCH NEXT ${queriedRowsPerPage} ROWS ONLY`;
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'password',
        server: laptopServerName, 
        database: 'purificationdb',
        synchronize: true,
        trustServerCertificate: true,
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        

        // query to the database and get the records
        request.query(mainQuery, function (err, response) {
            
            if (err) console.log(err);

            // send records as a response
            //mainDbQuery
            res.json({
                headers: Object.keys(response.recordsets[0][0]),
                rows: response.recordsets[0]
            });
        });
    });
})

app.get('/search', (req, res) => {
    const queriedOffset = req.query.offset;
    const queriedRowsPerPage = req.query.rowsPerPage;
    const searchParams = req.query.searchParams;
    const tempSearchQuery = `SELECT protein_name, doi, paper_name, pH, (ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') + ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','')) as salt, (ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') + ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') + ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') + ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') + ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') + ISNULL(CAST(ethylene_glycol_percent AS VARCHAR) + ' % ethylene_glycol ','') ) as buffering_agent, (ISNULL(CAST(CHAPS_percent AS VARCHAR) + ' % CHAPS ','') + ISNULL(CAST(glycerol_percent AS VARCHAR) + ' % glycerol ','') ) as detergent, (ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') + ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') + ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') + ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') +  ISNULL(CAST(PNEA_percent AS VARCHAR) + ' % sodium azide ','') + ISNULL(CAST(MTG_percent AS VARCHAR) + ' % MTG ','') + ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','') ) as additives, cleaned_text as text_block FROM ( SELECT DISTINCT  [protein_name] ,[UniProt] ,[doi],[paper_name],[pH],[NaCl],[Urea],[Tris],[Imidazole],[DTT],[KCl],[HEPES],[CaCl2],[EGTA],[TCEP],[MgCl2],[MES],[EDTA],[NaOAc],[Na2HPO4],[KH2PO4],[PBS],[GDP],[glycerol_percent],[CHAPS_percent],[PIPES],[PNEA_percent],[ethylene_glycol_percent],[MTG_percent],[ATP],[cleaned_text] FROM [purificationdb].[dbo].[DatabaseReferenceTableMar22Flat] as t1 RIGHT JOIN [purificationdb].[dbo].[Mar21DataFrameFlat] as t2 ON t1.PDB = t2.PDB WHERE SOUNDEX(protein_name) = SOUNDEX('${searchParams}')) as temp ORDER BY(SELECT NULL) OFFSET ${queriedOffset} ROWS FETCH NEXT ${queriedRowsPerPage} ROWS ONLY`
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'password',
        server: laptopServerName, 
        database: 'purificationdb',
        synchronize: true,
        trustServerCertificate: true,
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        

        // query to the database and get the records
        request.query(tempSearchQuery, function (err, response) {
            
            if (err) console.log(err);

            // send records as a response
            //mainDbQuery
            res.json({
                headers: Object.keys(response.recordsets[0][0]),
                rows: response.recordsets[0]
            });
        });
    });
})

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
