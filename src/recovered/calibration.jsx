// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
/* 公开脚本内嵌的真实校准数据；不重新估算、不改动数值。 */
let CALIBRATION_DATA = {
  generatedBy: "tools/calibration/build_calibration.mjs",
  inputs: [
    {
      name: "occupation_labels_22.csv",
      sha256:
        "631b52da2150bf57f6914750e5a09605ada4f0862f351673c9edd14c94bf7c4e",
      bytes: 1574,
    },
    {
      name: "cps2025_by_22_soc_majors.csv",
      sha256:
        "4711090aa45d62e8f7d447ef5ef91c1991d637798d84b34c1786a2dcf28dbb4c",
      bytes: 4250,
    },
    {
      name: "occ2010_master.csv",
      sha256:
        "d01667cf9199bcd7193a89834a9a36b59b12063c6f1fb6c1800dbf28e3568a6d",
      bytes: 89434,
    },
    {
      name: "ipums_by_22_soc_majors.csv",
      sha256:
        "60d1b9eb125f7e8b03fb169b71ff29181155256ea81f4b7f11069e45db6550cf",
      bytes: 13137,
    },
    {
      name: "ipums_weights_by_22_soc_majors.csv",
      sha256:
        "5c61bbdb17b48d9ade6fe91e3fec337dc653a9d20de389593d5293aee7de5202",
      bytes: 3400,
    },
    {
      name: "pi_N22_origin_shares.csv",
      sha256:
        "ef02e71bbe0750174c233e1a98c37a1a8e25bf01cf78eb803e4c422807131a4d",
      bytes: 2242,
    },
    {
      name: "pi_N22_corrected_2010_2019.csv",
      sha256:
        "5530a9a506f8d46991c2431d020a6589df196c7d7080b25186a26aa2766f0c18",
      bytes: 4120,
    },
    {
      name: "pi_N22_corrected_pooled.csv",
      sha256:
        "0f6d1812392af3dab5e64b3ec2cf9144f4388fc55c0d8ac65a33ffadedf35b3b",
      bytes: 4257,
    },
  ],
  groups: [
    {
      code: "C",
      name: "Cognitive",
      long: "Cognitive occupations (SOC 11–29, 41, 43: management, professional, sales, office)",
      members: [11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 41, 43],
      memberTitles: [
        "Management",
        "Business and financial operations",
        "Computer and mathematical",
        "Architecture and engineering",
        "Life, physical, and social science",
        "Community and social service",
        "Legal",
        "Education, training, and library",
        "Arts, design, entertainment, sports, and media",
        "Healthcare practitioners and technical",
        "Sales and related",
        "Office and administrative support",
      ],
    },
    {
      code: "N",
      name: "Other",
      long: "All other occupations (SOC 31–39, 45–53: service, farming, construction, maintenance, production, transportation)",
      members: [31, 33, 35, 37, 39, 45, 47, 49, 51, 53],
      memberTitles: [
        "Healthcare support",
        "Protective service",
        "Food preparation and serving related",
        "Building and grounds cleaning and maintenance",
        "Personal care and service",
        "Farming, fishing, and forestry",
        "Construction and extraction",
        "Installation, maintenance, and repair",
        "Production",
        "Transportation and material moving",
      ],
    },
  ],
  cps2025: {
    emp: [101942, 61551],
    unemp: [3158, 3372],
    w: [0.6235251662150673, 0.3764748337849327],
    uRate: [0.03004757373929591, 0.05193845016404048],
    uRateAgg: 0.03840656852308217,
  },
  oews2021: {
    emp: [0x4a8d88e, 0x2ee4f4c],
    w: [0.6138704865813117, 0.3861295134186883],
  },
  exposure: {
    beta: [0.47591004654728913, 0.15660316698364257],
    betaBar: 0.35569904213717973,
    mHatData: [1.3379570652983332, 0.4402687340474946],
    mHatNote: [1.6037845049145594, 0],
  },
  ipums: {
    w1019: {
      window: "2010–2019",
      eu: [0.008358559570558328, 0.01837914561784245],
      euLoser: [0.006013626883198662, 0.01368327635031571],
      euQuit: [9304633243328457e-19, 0.0017189032823379069],
      ue: [0.20701210969511233, 0.22923106038430682],
      stockE: [10901879985.6, 6831605689.6],
      stockU: [478714487.011, 577244894.3900001],
      nE: [3200989, 1929833],
      nU: [131671, 157256],
      u0: [0.0420641020258734, 0.07791288106651593],
      u0Agg: 0.05619960452371244,
      euAgg: 0.012202985529089064,
      ueAgg: 0.21909851292758759,
      euRel: [0.6890214806466161, 1.5150488573690546],
    },
    recent: {
      window: "2015–2019 and 2022–2024",
      eu: [0.007109456015492585, 0.014811664367271786],
      euLoser: [0.004836857704404203, 0.010565923196268038],
      euQuit: [0.0010496228767749938, 0.0018476427092328496],
      ue: [0.26052985156756625, 0.28398494074770475],
      stockE: [9341718358.7, 5632298096.2],
      stockU: [278034023.735, 312285666.34099996],
      nE: [2285999, 1331737],
      nU: [63268, 71943],
      u0: [0.028902409613231917, 0.052532806133345517],
      u0Agg: 0.037927714010889485,
      euAgg: 0.009990000566936191,
      ueAgg: 0.2728668335053803,
      euRel: [0.7102961334360681, 1.4798133509652218],
    },
    pooled: {
      window: "1994–2024",
      eu: [0.00866689626181951, 0.019396558653508825],
      euLoser: [0.006067211390248377, 0.014465137822985922],
      euQuit: [0.0011634644508199804, 0.0019815726264548294],
      ue: [0.2394108682188694, 0.2624474788040905],
      stockE: [32630740356.4, 20544168088.3],
      stockU: [1287360054.4099998, 1600246295.86],
      nE: [9682211, 5904947],
      nU: [354203, 438109],
      u0: [0.037954957347779615, 0.07226410543530397],
      u0Agg: 0.05150690012444963,
      euAgg: 0.012790737784705524,
      ueAgg: 0.2521120817284064,
      euRel: [0.682092045909488, 1.5265255260823543],
    },
  },
  matrices: {
    cps1019: {
      window: "2010–2019",
      label:
        "CPS 2010–2019, coding-error corrected (re-tabulated from the model team's excerpt with its steps re-implemented)",
      nTransitions: 46179,
      nOrigin: [19435, 26744],
      origin: [0.40650516269862436, 0.5934948373013753],
      pi: [
        [0.8127362986204133, 0.1872637013795866],
        [0.11248052749549695, 0.8875194725045031],
      ],
      switchShare: [0.1872637013795866, 0.11248052749549695],
      pooledSwitchShare: 0.14288027376236828,
      oddsProductMu: 0.17088411761765862,
    },
    cps7621: {
      window: "1976–2021",
      label:
        "CPS 1976–2021 pooled, coding-error corrected (the model team's tabulation, used as produced)",
      nTransitions: 296814,
      nOrigin: [111358, 185456],
      origin: [0.36844823746540967, 0.6315517625345906],
      pi: [
        [0.803567393056978, 0.19643260694302203],
        [0.10745739547084392, 0.892542604529156],
      ],
      switchShare: [0.19643260694302203, 0.10745739547084392],
      pooledSwitchShare: 0.14024015531588008,
      oddsProductMu: 0.17155339395513358,
    },
  },
  defaults: {
    shares: "cps2025",
    hazards: "w1019",
    matrix: "cps1019",
  },
  sources: {
    cps2025:
      "BLS Current Population Survey 2025 annual averages, table 11 (employed persons by occupation) and table 25b (unemployed persons by occupation of last job); workbook supplied by the model team, 2026-08-04",
    oews2021:
      "BLS Occupational Employment and Wage Statistics, May 2021, summed to SOC major groups (the model team's occupation crosswalk)",
    exposure:
      "Eloundou, Manning, Mishkin & Rock (2023) dv_rating_beta = E1 + 0.5 E2 by Census occupation, OEWS-2021-weighted within majors, CPS-2025-weighted across them (diagnostic only)",
    ipums:
      "IPUMS-CPS matched monthly panel (the model team's extract, 2026-08-04): monthly E→U hazard by major group of the job, U→E hazard by major group of the last job, u0 = U/(E+U); raw, not seasonally adjusted; aggregated with linked person-month weights; source: IPUMS CPS, University of Minnesota, www.ipums.org",
    matrices:
      "CPS unemployed job-finders’ destination matrix by SOC major group, occupational-coding-error corrected (Carrillo-Tudela & Visschers), from the model team's corrected matrix; aggregated from the 22 × 22 joint corrected flow matrix (sum blocks, row-normalise)",
  },
};
export { CALIBRATION_DATA };
