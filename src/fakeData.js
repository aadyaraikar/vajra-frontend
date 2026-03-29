export const fakeTransactions = [
  { id:"TXN001", amount:47000, merchant:"Unknown Vendor",
    score:94, risk:"HIGH",   time:"03:47 AM", device:"NEW",
    reason:"New device + 3am + 8x normal amount" },

  { id:"TXN002", amount:500,   merchant:"Swiggy",
    score:12, risk:"SAFE",   time:"01:23 PM", device:"known",
    reason:"Known device, normal amount, daytime" },

  { id:"TXN003", amount:8200,  merchant:"Amazon Pay",
    score:61, risk:"MEDIUM", time:"11:05 AM", device:"known",
    reason:"Slightly high amount, new merchant category" },

  { id:"TXN004", amount:95000, merchant:"Crypto Exchange",
    score:97, risk:"HIGH",   time:"02:13 AM", device:"NEW",
    reason:"Crypto merchant + new device + 2am + very high amount" },

  { id:"TXN005", amount:299,   merchant:"Netflix",
    score:8,  risk:"SAFE",   time:"09:44 AM", device:"known",
    reason:"Recurring subscription, known pattern" },

  { id:"TXN006", amount:15000, merchant:"New Merchant",
    score:73, risk:"MEDIUM", time:"08:30 PM", device:"NEW",
    reason:"New device + first time merchant" },

  { id:"TXN007", amount:1200,  merchant:"Zomato",
    score:5,  risk:"SAFE",   time:"12:30 PM", device:"known",
    reason:"Known device, normal food order amount" },

  { id:"TXN008", amount:82000, merchant:"Unknown Transfer",
    score:91, risk:"HIGH",   time:"04:02 AM", device:"NEW",
    reason:"New device + 4am + high amount + unknown recipient" },

  { id:"TXN009", amount:350,   merchant:"Uber",
    score:9,  risk:"SAFE",   time:"06:15 PM", device:"known",
    reason:"Regular ride, known device, normal amount" },

  { id:"TXN010", amount:28000, merchant:"Jewellery Store",
    score:68, risk:"MEDIUM", time:"07:45 PM", device:"known",
    reason:"Unusual merchant category for this user" },
];

export const fakeShapReasons = {
  TXN001: [
    { feature:"New Device",          value: 34, direction:"fraud" },
    { feature:"Amount vs Average",   value: 28, direction:"fraud" },
    { feature:"Hour (3:47am)",       value: 22, direction:"fraud" },
    { feature:"Unknown Merchant",    value: 18, direction:"fraud" },
    { feature:"Transaction Speed",   value: 8,  direction:"safe"  },
  ],
  TXN003: [
    { feature:"New Merchant Category", value: 29, direction:"fraud" },
    { feature:"Amount Slightly High",  value: 18, direction:"fraud" },
    { feature:"Known Device",          value: 20, direction:"safe"  },
    { feature:"Daytime Transaction",   value: 15, direction:"safe"  },
    { feature:"User History Normal",   value: 12, direction:"safe"  },
  ],
  TXN004: [
    { feature:"New Device",           value: 38, direction:"fraud" },
    { feature:"Crypto Merchant",      value: 31, direction:"fraud" },
    { feature:"2am Transaction",      value: 24, direction:"fraud" },
    { feature:"Very Large Amount",    value: 20, direction:"fraud" },
    { feature:"No Transaction History",value:15, direction:"fraud" },
  ],
  TXN006: [
    { feature:"New Device",           value: 32, direction:"fraud" },
    { feature:"First Time Merchant",  value: 24, direction:"fraud" },
    { feature:"Evening Transaction",  value: 8,  direction:"safe"  },
    { feature:"Moderate Amount",      value: 12, direction:"safe"  },
  ],
  TXN008: [
    { feature:"New Device",           value: 36, direction:"fraud" },
    { feature:"4am Transaction",      value: 28, direction:"fraud" },
    { feature:"Large Amount",         value: 22, direction:"fraud" },
    { feature:"Unknown Recipient",    value: 19, direction:"fraud" },
    { feature:"No Prior Transfers",   value: 14, direction:"fraud" },
  ],
};

export const fakeFraudTrend = [
  { time:"00:00", rate:0.8 },
  { time:"02:00", rate:2.1 },
  { time:"04:00", rate:3.4 },
  { time:"06:00", rate:1.2 },
  { time:"08:00", rate:0.6 },
  { time:"10:00", rate:0.4 },
  { time:"12:00", rate:0.5 },
  { time:"14:00", rate:0.7 },
  { time:"16:00", rate:0.9 },
  { time:"18:00", rate:1.1 },
  { time:"20:00", rate:1.8 },
  { time:"22:00", rate:2.3 },
];

export const fakeMerchantFraud = [
  { merchant:"Unknown",    count:18 },
  { merchant:"Crypto",     count:12 },
  { merchant:"Jewellery",  count:8  },
  { merchant:"New Vendor", count:7  },
  { merchant:"Travel",     count:4  },
  { merchant:"Food",       count:2  },
];


// Add this to your existing fakeData.js file

export const velocityData = [
  { time: new Date(2026, 2, 27, 10, 0), vol: 120 }, 
  { time: new Date(2026, 2, 27, 10, 5), vol: 150 },
  { time: new Date(2026, 2, 27, 10, 10), vol: 130 }, 
  { time: new Date(2026, 2, 27, 10, 15), vol: 890 }, // The Spike!
  { time: new Date(2026, 2, 27, 10, 20), vol: 140 }, 
  { time: new Date(2026, 2, 27, 10, 25), vol: 160 }
];

export const lightMerchantData = [
  { merchant: "Unknown", count: 85 }, 
  { merchant: "Crypto", count: 62 },
  { merchant: "Jewellery", count: 45 }, 
  { merchant: "Gaming", count: 30 }
];

export const lightNetworkData = {
  nodes: [
    { id: "Attacker", r: 16, color: "#000000" }, 
    { id: "Mule 1", r: 10, color: "#83AF3B" }, 
    { id: "Mule 2", r: 10, color: "#83AF3B" }, 
    { id: "Victim A", r: 6, color: "#e5e7eb" }, 
    { id: "Victim B", r: 6, color: "#e5e7eb" }, 
    { id: "Victim C", r: 6, color: "#e5e7eb" }
  ],
  links: [
    { source: "Attacker", target: "Mule 1" }, { source: "Attacker", target: "Mule 2" },
    { source: "Mule 1", target: "Victim A" }, { source: "Mule 1", target: "Victim B" },
    { source: "Mule 2", target: "Victim C" }
  ]
};