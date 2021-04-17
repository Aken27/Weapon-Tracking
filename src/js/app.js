app = {
    contracts: {},
    web3Provider: null, 
    
    
    init: async function(){
      return await app.initWeb3();
    },

    initWeb3: async function() 
			{
				// Modern dapp browsers...
			 if (window.ethereum) {
			   app.web3Provider = window.ethereum;
			   try {
				 // Request account access
				 await window.ethereum.enable();
			   } catch (error) {
				 // User denied account access...
				 console.error("User denied account access")
			   }
			 }
			 // Legacy dapp browsers...
			 else if (window.web3) {
			   app.web3Provider = window.web3.currentProvider;
			 }
			 // If no injected web3 instance is detected, fall back to Ganache
			 else {
			   app.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
         
         alert("Inside Ganache");
        }
			 web3 = new Web3(app.web3Provider);
       web3.eth.defaultAccount=web3.eth.accounts[0]
			 
				 return app.initContract();
			   },
    
    initContract: function() {
      $.getJSON('Tracer.json', function(data){
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
    var TracerArtifact = data;
    app.contracts.Tracer = TruffleContract(TracerArtifact);
   
    // Set the provider for our contract
    app.contracts.Tracer.setProvider(app.web3Provider);
    
    var tracerInstance;
    app.contracts.Tracer.deployed().then(function(instance){
      tracerInstance = instance;


      //Create Asset UUID on click function

      document.getElementById('AssetCreate').onclick = async function(){
        
        if(document.getElementById("AssetType").value !=="" && document.getElementById("AssetMan").value !== "" && document.getElementById("Init").value!==""){

         var uuid  = await tracerInstance.createAsset(document.getElementById("AssetType").value, document.getElementById("AssetMan").value,document.getElementById("Init").value);
         
        var uuidArr = await tracerInstance.getAssetsUUIDs();
        await tracerInstance.assetStore(uuidArr[0]);
        await tracerInstance.entityStore(web3.eth.defaultAccount,uuidArr[0]);
        document.getElementById('AssetUUID').value = uuidArr[0];
        
        }

         },

         //Create manufacturer on click function
      document.getElementById('CreateMan').onclick =  async function(){
        if(document.getElementById("ManName").value !== "" && document.getElementById("ManFFL").value !== ""){
          await tracerInstance.createManufacturer(document.getElementById("ManName").value, document.getElementById("ManFFL").value);
         document.getElementById("ManAddr").value= await tracerInstance.getManufacturerAddress(document.getElementById("ManName").value);
          
        }
         },

         //Create Vendor on click function
         document.getElementById('CreateDeal').onclick = async function(){
          if(document.getElementById("DealName").value !== "" && document.getElementById("DealFFL").value !== ""){
            await tracerInstance.createVendor(document.getElementById("DealName").value, document.getElementById("DealFFL").value);
            document.getElementById("DealerAddr").value = await tracerInstance.getVendorAddress(document.getElementById("DealName").value);
          }
          
        },

        // Ceate Buyer on click function
        document.getElementById('CreateOwner').onclick = async function(){
          if(document.getElementById("OwnerName").value !== "" && document.getElementById("OwnerAge").value >= 21){
            await tracerInstance.createBuyer(document.getElementById("OwnerName").value, document.getElementById("OwnerAge").value);
            document.getElementById("OwnerAddr").value = await tracerInstance.getBuyerAddress(document.getElementById("OwnerName").value);
          }else{
            alert("The buyer is under legal age to buy a weapon:" + document.getElementById("OwnerAge").value);
          }
          
        },
        //Tranfer asset on click function
        document.getElementById('TransferAsset').onclick = async function(){
          if(document.getElementById("TransferAssUUID").value == document.getElementById('AssetUUID').value && document.getElementById("TransferTo").value !== ""){
            if (document.getElementById("Init").value == "false"){
              
              document.getElementById("TransferSuccess").value = " Transfer Failed";
              alert("Check the entered details or maybe the weapon is not initialized");
             
            }
            else if(document.getElementById("TransferTo").value == document.getElementById("ManAddr").value){
              if (document.getElementById("ManFFL").value == "false"){
              
                document.getElementById("TransferSuccess").value = " Transfer Failed";
              alert("Check the entered details or maybe the asset or entity is not initialized");
              }
              else{
                await tracerInstance.transferAsset(document.getElementById("TransferTo").value,document.getElementById("TransferAssUUID").value);
              
                document.getElementById("TransferSuccess").value = "Transfer Successful";
                alert("Weapon is transfered to MANUFACTURER");
              
              }
            }
            else if(document.getElementById("TransferTo").value == document.getElementById("DealerAddr").value){
              if (document.getElementById("DealFFL").value == "false"){
                
                document.getElementById("TransferSuccess").value = " Transfer Failed";
              alert("Check the entered details or maybe the asset or entity is not initialized");
              }
              else{
                await tracerInstance.transferAsset(document.getElementById("TransferTo").value,document.getElementById("TransferAssUUID").value);
              
                  document.getElementById("TransferSuccess").value = "Transfer Successful";
                  alert("Weapon is transfered to DEALER");
                
              }
            }
            else {
              await tracerInstance.transferAsset(document.getElementById("TransferTo").value,document.getElementById("TransferAssUUID").value);
              
                  document.getElementById("TransferSuccess").value = "Transfer Successful";
                  alert("You are the now the owner of the weapon with uuid:" +(document.getElementById("TransferAssUUID").value));
                
            }
          }
      }
    });
      });
  }
}
 
  


$(function() {
			$(window).load(function() {
			  app.init();
			});
});
