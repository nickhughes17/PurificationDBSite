const cors = require('cors');
var express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
var app = express();

var desktopServerName = "DESKTOP-S8PA8GT\\SQLEXPRESS"
var laptopServerName = "LAPTOP-D4ETF9F5\\SQLEXPRESS"

app.use(express.static('public'));
app.use(cors({origin: "http://localhost:3000"}));

app.get('/main', (req, res) => {
    const queriedOffset = req.query.offset;
    const queriedRowsPerPage = req.query.rowsPerPage;
    const mainQuery = `SELECT
	    t.UniProt, t.protein_name,
        PDB = 
            STUFF((
                SELECT ',' + PDB
                FROM [purificationdb].[dbo].[ReferenceTableApril18]
                WHERE protein_name = t.protein_name
                ORDER BY PDB
                FOR XML PATH(''), TYPE
            ).value('text()[1]','NVARCHAR(MAX)'), 1, 1, N'')
            
            FROM [purificationdb].[dbo].[ReferenceTableApril18] t
            WHERE main_name_flag = 0
            GROUP BY t.protein_name, t.UniProt
             ORDER BY(SELECT NULL) OFFSET ${queriedOffset} ROWS FETCH NEXT ${queriedRowsPerPage} ROWS ONLY`;
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'password',
        server: desktopServerName, 
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
            res.json({
                headers: Object.keys(response.recordsets[0][0]),
                rows: response.recordsets[0]
            });
        });
    });
})

app.get('/search', (req, res) => {
    const searchParams = req.query.searchParams;
    var databaseToSearch = req.query.databaseToSearch;

    const proteinSearchQuery = `SELECT UniProt, protein_name, doi, paper_name, pH, 
        (ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + 
         ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + 
         ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + 
         ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + 
         ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + 
         ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') +
         ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + 
         ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','') +
         ISNULL(CAST(NaH2PO4 AS VARCHAR) + ' mM NaH2PO4 ','')
        ) as salt,
        (ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + 
         ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + 
         ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') +
         ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') +
         ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') +
         ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') +
         ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') +
         ISNULL(CAST(ethylene_glycol_unit AS VARCHAR) + ' ethylene_glycol ','')+
         ISNULL(CAST(Bis_Tris AS VARCHAR) + ' mM Bis-Tris ','') +
         ISNULL(CAST(PEG_unit AS VARCHAR) + ' PEG ','')
        ) as buffering_agent,
        (ISNULL(CAST(CHAPS_unit AS VARCHAR) + ' CHAPS ','') +
         ISNULL(CAST(glycerol_unit AS VARCHAR) + ' glycerol ','')
        ) as detergent,
        (ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') +
         ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') +
         ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') +
         ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') + 
         ISNULL(CAST(PNEA_unit AS VARCHAR) + ' sodium azide ','') +
         ISNULL(CAST(MTG AS VARCHAR) + ' mM MTG ','') +
         ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','') +
         ISNULL(CAST(BME AS VARCHAR) + ' mM BME ','') +
         ISNULL(CAST(Methionine AS VARCHAR) + ' mM Methionine ','') +
         ISNULL(CAST(citric_acid AS VARCHAR) + ' mM citric acid ','')
        ) as additives,
        cleaned_text as text_block

        FROM (
        SELECT DISTINCT 
            [protein_name]
            ,[UniProt]
            ,[doi]
            ,[paper_name]
            ,[sentence_index]
            ,[pH]
            ,[NaCl]
            ,[Urea]
            ,[Tris]
            ,[Imidazole]
            ,[DTT]
            ,[KCl]
            ,[HEPES]
            ,[CaCl2]
            ,[EGTA]
            ,[TCEP]
            ,[MgCl2]
            ,[MES]
            ,[EDTA]
            ,[NaOAc]
            ,[Na2HPO4]
            ,[KH2PO4]
            ,[PBS]
            ,[GDP]
            ,[PIPES]
            ,[ATP]
            ,[BME]
            ,[Methionine]
            ,[Bis_Tris]
            ,[NaH2PO4]
            ,[MTG]
            ,[citric_acid]
            ,[glycerol_unit]
            ,[CHAPS_unit]
            ,[PNEA_unit]
            ,[ethylene_glycol_unit]
            ,[PEG_unit]
            ,[cleaned_text]
            ,[Chromatography_Type]
        
        FROM [purificationdb].[dbo].[FinalDataFrameApril18] as t1
        RIGHT JOIN [purificationdb].[dbo].[ReferenceTableApril18] as t2
        ON t1.PDB = t2.PDB
        
        WHERE SOUNDEX(protein_name)=SOUNDEX('${searchParams}')
        
        
        ) as temp
        
        ORDER by sentence_index`
    const sequenceSearchQuery = `SELECT UniProt, protein_name, [Sequence], doi, paper_name, pH, 
        (ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + 
         ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + 
         ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + 
         ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + 
         ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + 
         ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') +
         ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + 
         ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','') +
         ISNULL(CAST(NaH2PO4 AS VARCHAR) + ' mM NaH2PO4 ','')
        ) as salt,
        (ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + 
         ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + 
         ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') +
         ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') +
         ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') +
         ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') +
         ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') +
         ISNULL(CAST(ethylene_glycol_unit AS VARCHAR) + ' ethylene_glycol ','')+
         ISNULL(CAST(Bis_Tris AS VARCHAR) + ' mM Bis-Tris ','') +
         ISNULL(CAST(PEG_unit AS VARCHAR) + ' PEG ','')
        ) as buffering_agent,
        (ISNULL(CAST(CHAPS_unit AS VARCHAR) + ' CHAPS ','') +
         ISNULL(CAST(glycerol_unit AS VARCHAR) + ' glycerol ','')
        ) as detergent,
        (ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') +
         ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') +
         ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') +
         ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') + 
         ISNULL(CAST(PNEA_unit AS VARCHAR) + ' sodium azide ','') +
         ISNULL(CAST(MTG AS VARCHAR) + ' mM MTG ','') +
         ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','') +
         ISNULL(CAST(BME AS VARCHAR) + ' mM BME ','') +
         ISNULL(CAST(Methionine AS VARCHAR) + ' mM Methionine ','') +
         ISNULL(CAST(citric_acid AS VARCHAR) + ' mM citric acid ','')
        ) as additives,
        cleaned_text as text_block
            
        FROM (
        SELECT DISTINCT 
            [protein_name]
            ,[UniProt],
            [Sequence]
            ,[doi]
            ,[paper_name]
            ,[sentence_index]
            ,[pH]
            ,[NaCl]
            ,[Urea]
            ,[Tris]
            ,[Imidazole]
            ,[DTT]
            ,[KCl]
            ,[HEPES]
            ,[CaCl2]
            ,[EGTA]
            ,[TCEP]
            ,[MgCl2]
            ,[MES]
            ,[EDTA]
            ,[NaOAc]
            ,[Na2HPO4]
            ,[KH2PO4]
            ,[PBS]
            ,[GDP]
            ,[PIPES]
            ,[ATP]
            ,[BME]
            ,[Methionine]
            ,[Bis_Tris]
            ,[NaH2PO4]
            ,[MTG]
            ,[citric_acid]
            ,[glycerol_unit]
            ,[CHAPS_unit]
            ,[PNEA_unit]
            ,[ethylene_glycol_unit]
            ,[PEG_unit]
            ,[cleaned_text]
            ,[Chromatography_Type]
        
        FROM [purificationdb].[dbo].[FinalDataFrameApril18] as t1
        RIGHT JOIN [purificationdb].[dbo].[ReferenceTableApril18] as t2
        ON t1.PDB = t2.PDB
        
        WHERE SOUNDEX([Sequence])=SOUNDEX('${searchParams}')
        
        
        ) as temp
        
        ORDER by sentence_index`
    const uniprotSearchQuery = `
        SELECT UniProt, protein_name, doi, paper_name, pH, 
    		(ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + 
    		 ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + 
    		 ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + 
    		 ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + 
    		 ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + 
    		 ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') +
    		 ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + 
    		 ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','') +
    		 ISNULL(CAST(NaH2PO4 AS VARCHAR) + ' mM NaH2PO4 ','')
    		) as salt,
    		(ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + 
    		 ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + 
    		 ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') +
    		 ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') +
    		 ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') +
    		 ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') +
    		 ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') +
    		 ISNULL(CAST(ethylene_glycol_unit AS VARCHAR) + ' ethylene_glycol ','')+
    		 ISNULL(CAST(Bis_Tris AS VARCHAR) + ' mM Bis-Tris ','') +
    		 ISNULL(CAST(PEG_unit AS VARCHAR) + ' PEG ','')
    		) as buffering_agent,
    		(ISNULL(CAST(CHAPS_unit AS VARCHAR) + ' CHAPS ','') +
    		 ISNULL(CAST(glycerol_unit AS VARCHAR) + ' glycerol ','')
    		) as detergent,
    		(ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') +
    		 ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') +
    		 ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') +
    		 ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') + 
    		 ISNULL(CAST(PNEA_unit AS VARCHAR) + ' sodium azide ','') +
    		 ISNULL(CAST(MTG AS VARCHAR) + ' mM MTG ','') +
    		 ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','') +
    		 ISNULL(CAST(BME AS VARCHAR) + ' mM BME ','') +
    		 ISNULL(CAST(Methionine AS VARCHAR) + ' mM Methionine ','') +
    		 ISNULL(CAST(citric_acid AS VARCHAR) + ' mM citric acid ','')
    		) as additives,
    		cleaned_text as text_block

    FROM (
    	SELECT DISTINCT 
    		[protein_name]
    		,[UniProt]
    		,[doi]
    		,[paper_name]
    		,[sentence_index]
    		,[pH]
    		,[NaCl]
    		,[Urea]
    		,[Tris]
    		,[Imidazole]
    		,[DTT]
    		,[KCl]
    		,[HEPES]
    		,[CaCl2]
    		,[EGTA]
    		,[TCEP]
    		,[MgCl2]
    		,[MES]
    		,[EDTA]
    		,[NaOAc]
    		,[Na2HPO4]
    		,[KH2PO4]
    		,[PBS]
    		,[GDP]
    		,[PIPES]
    		,[ATP]
    		,[BME]
    		,[Methionine]
    		,[Bis_Tris]
    		,[NaH2PO4]
    		,[MTG]
    		,[citric_acid]
    		,[glycerol_unit]
    		,[CHAPS_unit]
    		,[PNEA_unit]
    		,[ethylene_glycol_unit]
    		,[PEG_unit]
    		,[cleaned_text]
    		,[Chromatography_Type]

    	FROM [purificationdb].[dbo].[FinalDataFrameApril18] as t1
    	RIGHT JOIN [purificationdb].[dbo].[ReferenceTableApril18] as t2
    	ON t1.PDB = t2.PDB

    	WHERE UniProt = '${searchParams}'
    

    ) as temp

        ORDER by sentence_index`

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'password',
        server: desktopServerName, 
        database: 'purificationdb',
        synchronize: true,
        trustServerCertificate: true,
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        

        if(databaseToSearch === "protein"){
            // query to the protein database and get the records
            request.query(proteinSearchQuery, function (err, response) {
                if (err) console.log(err);
                // send records as a response
                

                res.json({
                    headers: Object.keys(response.recordsets[0][0]),
                    rows: response.recordsets[0]
                });
            });
        } else if(databaseToSearch === "uniprot"){
            // query to the uniprot database and get the records
            //NEED TO REPLACE THE tempSearchQuery WITH EACH DB'S QUERY
            request.query(uniprotSearchQuery, function (err, response) {
                if (err) console.log(err);
                // send records as a response
                res.json({
                    headers: Object.keys(response.recordsets[0][0]),
                    rows: response.recordsets[0]
                });
            });
        } else if(databaseToSearch === "sequence"){
            // query to the sequence database and get the records
            //NEED TO REPLACE THE tempSearchQuery WITH EACH DB'S QUERY
            request.query(sequenceSearchQuery, function (err, response) {
                if (err) console.log(err);
                // send records as a response
                res.json({
                    headers: Object.keys(response.recordsets[0][0]),
                    rows: response.recordsets[0]
                });
            });
        } else{
            console.log("ERROR REACHING DATABASE " + databaseToSearch);
        }
        
    });
})

app.get('/entry', (req, res) => {
    const entryparams = req.query.entryparams;
    const entryQuery = `SELECT protein_name, doi, paper_name, pH, 
        (ISNULL(CAST(NaCl AS VARCHAR) + ' mM NaCl ','') + 
         ISNULL(CAST(KCl AS VARCHAR) + ' mM KCl ','') + 
         ISNULL(CAST(CaCl2 AS VARCHAR) + ' mM CaCl2 ','') + 
         ISNULL(CAST(TCEP AS VARCHAR) + ' mM TCEP ','') + 
         ISNULL(CAST(MgCl2 AS VARCHAR) + ' mM MgCl2 ','') + 
         ISNULL(CAST(NaOAc AS VARCHAR) + ' mM NaOAc ','') +
         ISNULL(CAST(Na2HPO4 AS VARCHAR) + ' mM Na2HPO4 ','') + 
         ISNULL(CAST(KH2PO4 AS VARCHAR) + ' mM KH2PO4 ','') +
         ISNULL(CAST(NaH2PO4 AS VARCHAR) + ' mM NaH2PO4 ','')
        ) as salt,
        (ISNULL(CAST(Urea AS VARCHAR) + ' mM Urea ','') + 
         ISNULL(CAST(Tris AS VARCHAR) + ' mM Tris ','') + 
         ISNULL(CAST(Imidazole AS VARCHAR) + ' mM Imidazole ','') +
         ISNULL(CAST(HEPES AS VARCHAR) + ' mM HEPES ','') +
         ISNULL(CAST(MES AS VARCHAR) + ' mM MES ','') +
         ISNULL(CAST(PBS AS VARCHAR) + ' mM PBS ','') +
         ISNULL(CAST(PIPES AS VARCHAR) + ' mM PIPES ','') +
         ISNULL(CAST(ethylene_glycol_unit AS VARCHAR) + ' ethylene_glycol ','')+
         ISNULL(CAST(Bis_Tris AS VARCHAR) + ' mM Bis-Tris ','') +
         ISNULL(CAST(PEG_unit AS VARCHAR) + ' PEG ','')
        ) as buffering_agent,
        (ISNULL(CAST(CHAPS_unit AS VARCHAR) + ' CHAPS ','') +
         ISNULL(CAST(glycerol_unit AS VARCHAR) + ' glycerol ','')
        ) as detergent,
        (ISNULL(CAST(DTT AS VARCHAR) + ' mM DTT ','') +
         ISNULL(CAST(EGTA AS VARCHAR) + ' mM EGTA ','') +
         ISNULL(CAST(EDTA AS varchar) + ' mM EDTA ','') +
         ISNULL(CAST(GDP AS VARCHAR) + ' mM GDP ','') + 
         ISNULL(CAST(PNEA_unit AS VARCHAR) + ' sodium azide ','') +
         ISNULL(CAST(MTG AS VARCHAR) + ' mM MTG ','') +
         ISNULL(CAST(ATP AS VARCHAR) + ' mM ATP ','') +
         ISNULL(CAST(BME AS VARCHAR) + ' mM BME ','') +
         ISNULL(CAST(Methionine AS VARCHAR) + ' mM Methionine ','') +
         ISNULL(CAST(citric_acid AS VARCHAR) + ' mM citric acid ','')
        ) as additives,
        cleaned_text as text_block

    FROM (
    SELECT DISTINCT 
        [protein_name]
        ,[UniProt]
        ,[doi]
        ,[paper_name]
        ,[sentence_index]
        ,[pH]
        ,[NaCl]
        ,[Urea]
        ,[Tris]
        ,[Imidazole]
        ,[DTT]
        ,[KCl]
        ,[HEPES]
        ,[CaCl2]
        ,[EGTA]
        ,[TCEP]
        ,[MgCl2]
        ,[MES]
        ,[EDTA]
        ,[NaOAc]
        ,[Na2HPO4]
        ,[KH2PO4]
        ,[PBS]
        ,[GDP]
        ,[PIPES]
        ,[ATP]
        ,[BME]
        ,[Methionine]
        ,[Bis_Tris]
        ,[NaH2PO4]
        ,[MTG]
        ,[citric_acid]
        ,[glycerol_unit]
        ,[CHAPS_unit]
        ,[PNEA_unit]
        ,[ethylene_glycol_unit]
        ,[PEG_unit]
        ,[cleaned_text]
        ,[Chromatography_Type]

    FROM [purificationdb].[dbo].[FinalDataFrameApril18] as t1
    RIGHT JOIN [purificationdb].[dbo].[ReferenceTableApril18] as t2
    ON t1.PDB = t2.PDB

    WHERE main_name_flag = 1 AND UniProt='${entryparams}'


    ) as temp

    ORDER by sentence_index`;
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'password',
        server: desktopServerName, 
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
        request.query(entryQuery, function (err, response) {
            if (err) console.log(err);
            // send records as a response
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
