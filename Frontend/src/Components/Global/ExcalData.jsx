import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExport = () => {
  const rawText = `T/P TUC TP 16g 24x24
BP TUC BP 32g 12x24
S/P Candi Original SP 66g 6x24
S/P Gala Egg SP 62.4g 6x24 (NP 11-13)
T/P Candi Original TP 18g 24x24
T/P Gala Egg TP 15.6g 24x24
MHR Candi Original MHR 36g 12x24
S/P Wheatable Sugar Free SP 57g 1x96
S/P Prince Chocolate SP 57g 6x24
T/P Prince Chocolate TP 19g 24x24
B/P Tiger BP 22.5g 24x24
S/P TUC SP 48g 6x24 (NP0814)
T/P Bakeri Nankhatai TP 14g 24x24
B/P Bakeri Nankhatai BP 28g 12x24
S/P Bakeri Nankhatai SP 49g 6x24
BP Gala Egg BP 31.2g 12x24
S/P Bakeri Bistiks SP 51.2g 6x24 [ND]
B/P Bakeri Bistiks BP 32g 12x24 [ND]
S/P Bakeri Butter SP 48g 6x24 [ND]
B/P Bakeri Butter BP 24g 12x24 [ND]
S/P Bakeri Classic SP 56.7g 6x24 [ND]
S/P Bakeri Coconut SP 48g 6x24 [ND]
T/P Bakeri Coconut TP 12g 24x24 [ND]
B/P Prince Chocolate BP 38g 12x24
S/P Zeera Plus SP 71.5g 6x24 [ND]
T/P Zeera Plus TP 16.5g 24x24 [ND]
MHR Zeera Plus MHR 33g 12x24 [ND]
F/P Candi Original FP 108g 1x96 NP116
F/P Gala Egg FP 114.4g 1x96 NP116
F/P TUC FP 84g 1x96 NP116
F/P Prince Chocolate FP 95g 1x96 NP116
F/P Wheatable Sugar Free FP114g 1x48 NP116
F/P Bakeri Nankhatai FP 84g 1x96 NP116
F/P Bakeri Bistiks FP 89.6g 1x96 [ND] NP116
F/P Bakeri Butter FP 84g 1x96 [ND] NP116
F/P Bakeri Classic FP 107.1g 1x96 [ND] NP116
T/P Bakeri Classic TP 18.9g 24x24 [ND] NP116
F/P Bakeri Coconut FP 84g 1x96 [ND] NP116
F/P Zeera Plus FP 126.5g 1x96 [ND] NP116
T/P Bakeri Butter TP 12g 24x24
F/P Wheatable HighFiber FP129.6g 1x48 [ND]
S/P Wheatable High Fiber SP 64.8g 1x96 [ND]
T/P Oreo Original TP 19.6g 24x24 [ND]
B/P Oreo Orignal BP29.4g 12x24(300GSM w/o UV
S/P Prince Chocolate SP 57g 6x24 Auto [ND]
S/P Oreo Orignal SP58.8g 6x24(300GSM w/o UV)
F/P Oreo Orignal FP117.6g 1x96(300GSM w/o UV
MHR Zeera Plus MHR 33g 13x24 [CP]
S/P Oreo Original SP 58.8g 6x24 [Storeo LEP]
B/P Oreo Original BP29.4g 12x24 [Storeo LEP]
T/P Oreo Original TP19.6g 24x24 [Storeo LEP]
S/P TUC SP 48g 6x24 [CP Young?s]
S/P Zeera Plus SP 71.5g 6x24 [CP Vital]
B/P Tiger BP 22.5g 24x24 [ND]
B/P Tiger BP 22.5g 25x24 [CP]
B/P TUC BP 32g 12x24 [CP Nescafe]
B/P Oreo Original BP29.4g 12x24 [CP Cadbury]
B/P Oreo Orignal BP29.4g 12x24[Lunchbox LEP]
T/P Wheatable High Fibre
T/P Wheatable Sugar Free
B/P Bakeri Bistiks BP 32g 12x24 [ND] - LMT
B/P Bakeri Butter BP 24g 12x24 [ND] - LMT
B/P Bakeri Nankhatai BP 28g 12x24 - LMT
B/P Oreo Original BP29.4g 12x24 [CP Cadbury] - LMT
B/P Oreo Original BP29.4g 12x24 [Storeo LEP] - LMT
B/P Oreo Orignal BP29.4g 12x24(300GSM w/o UV - LMT
B/P Oreo Orignal BP29.4g 12x24[Lunchbox LEP] - LMT
B/P Prince Chocolate BP 38g 12x24 - LMT
B/P Tiger BP 22.5g 24x24 - LMT
B/P Tiger BP 22.5g 24x24 [ND] - LMT
B/P Tiger BP 22.5g 25x24 [CP] - LMT
B/P TUC BP 32g 12x24 - LMT
B/P TUC BP 32g 12x24 [CP Nescafe] - LMT
F/P Bakeri Bistiks FP 89.6g 1x96 [ND] NP116 - LMT
F/P Bakeri Butter FP 84g 1x96 [ND] NP116 - LMT
F/P Bakeri Classic FP 107.1g 1x96 [ND] NP116 - LMT
F/P Bakeri Coconut FP 84g 1x96 [ND] NP116 - LMT
F/P Bakeri Nankhatai FP 84g 1x96 NP116 - LMT
F/P Candi Original FP 108g 1x96 NP116 - LMT
F/P Gala Egg FP 114.4g 1x96 NP116 - LMT
F/P Oreo Orignal FP117.6g 1x96(300GSM w/o UV - LMT
F/P Prince Chocolate FP 95g 1x96 NP116 - LMT
F/P TUC FP 84g 1x96 NP116 - LMT
F/P Wheatable HighFiber FP129.6g 1x48 [ND] - LMT
F/P Wheatable Sugar Free FP114g 1x48 NP116 - LMT
F/P Zeera Plus FP 126.5g 1x96 [ND] NP116 - LMT
MHR Candi Original MHR 36g 12x24 - LMT
BP Gala Egg BP 31.2g 12x24 LMT
MHR Zeera Plus MHR 33g 12x24 [ND] - LMT
MHR Zeera Plus MHR 33g 13x24 [CP] - LMT
S/P Bakeri Bistiks SP 51.2g 6x24 [ND] - LMT
S/P Bakeri Butter SP 48g 6x24 [ND] - LMT
S/P Bakeri Classic SP 56.7g 6x24 [ND] - LMT
S/P Bakeri Coconut SP 48g 6x24 [ND] - LMT
S/P Bakeri Nankhatai SP 49g 6x24 - LMT
S/P Candi Original SP 66g 6x24 - LMT
S/P Gala Egg SP 62.4g 6x24 (NP 11-13) - LMT
S/P Oreo Original SP 58.8g 6x24 [Storeo LEP] - LMT
S/P Oreo Orignal SP58.8g 6x24(300GSM w/o UV) - LMT
S/P Prince Chocolate SP 57g 6x24 -LMT - LMT
S/P Prince Chocolate SP 57g 6x24 Auto [ND] - LMT
S/P TUC SP 48g 6x24 (NP0814) - LMT
S/P TUC SP 48g 6x24 [CP Young?s] - LMT
S/P Wheatable High Fiber SP 64.8g 1x96 [ND] - LMT
S/P Wheatable Sugar Free SP 57g 1x96 - LMT
S/P Zeera Plus SP 71.5g 6x24 [CP Vital] - LMT
S/P Zeera Plus SP 71.5g 6x24 [ND] - LMT
T/P Bakeri Butter TP 12g 24x24 - LMT
T/P Bakeri Classic TP 18.9g 24x24 [ND] NP116 - LMT
T/P Bakeri Coconut TP 12g 24x24 [ND] - LMT
T/P Bakeri Nankhatai TP 14g 24x24 - LMT
T/P Candi Original TP 18g 24x24 - LMT
T/P Gala Egg TP 15.6g 24x24 - LMT
T/P Oreo Original TP 19.6g 24x24 [ND] - LMT
T/P Oreo Original TP19.6g 24x24 [Storeo LEP] - LMT
T/P Prince Chocolate TP 19g 24x24 - LMT
T/P TUC TP 16g 24x24 - LMT
T/P Wheatable High Fibre - LMT
T/P Wheatable Sugar Free - LMT
T/P Zeera Plus TP 16.5g 24x24 [ND] - LMT
F/P Oreo Original FP Tube 117.6g 1x24 NP216 - LMT
OREO Crush 454gm 1x24 - LMT
Wheatable Sugar Free FP 114g 1x48 [CP] - LMT
MHR Zeera Plus MHR 33g 13x24 [CP]
B/P Oreo Original BP 29.4g 13x24 [CP]
B/P Oreo Original BP 29.4g 13x24 [CP] - LMT
S/P TUC SP 48g 12x12 [CP]
S/P TUC SP 48g 12x12 [CP] - LMT
S/P Wheatable Sugar Free SP 57g 6x24
S/P Wheatable High Fiber SP 64.8g 6x24
S/P Wheatable Sugar Free SP 57g 6x24 - LMT
S/P Wheatable High Fiber SP 64.8g 6x24 - LMT
B/P Tiger BP 22.5g 24x24 [CP KFC]
B/P Tiger BP 22.5g 24x24 [CP KFC] - LMT
T/P Prince Chocolate TP 19g 24x24 [CP]
T/P Prince Chocolate TP 19g 24x24 [CP] - LMT
S/P Prince Chocolate SP 57g 6x24 [CP]
S/P Prince Chocolate SP 57g 6x24 [CP] - LMT
B/P Prince Chocolate BP 38g 13x24 [CP]
B/P Prince Chocolate BP 38g 13x24 [CP] - LMT
B/P TUC BP 32g 13x24 [CP]
B/P TUC BP 32g 13x24 [CP] - LMT
T/P Oreo Original TP 19.6g 25x24 [CP]
T/P Oreo Original TP 19.6g 25x24 [CP] - LMT
B/P Oreo Original BP29.4g 12x24 [Dunk Glass]
B/P Oreo Original BP29.4g 12x24 [Dunk Glass] - LMT
BP Gala Egg 31.2g 13x24 CP
MHR Candi Original 36g 13x24 [CP]
BP Gala Egg 31.2g 13x24 CP LMT
MHR Candi Original 36g 13x24 [CP] - LMT
BP Gala Egg 31.2g 13x24 CP
MHR Candi Original 36g 13x24 [CP]
BP Gala Egg 31.2g 13x24 CP LMT
MHR Candi Original 36g 13x24 [CP] - LMT
B/P Oreo Original BP29.4g 12x24 [Dunk Glass]
B/P Oreo Original BP29.4g 12x24 [Dunk Glass] - LMT
B/P Oreo Original BP29.4g 12x24 [Dunk Glass]
B/P Oreo Original BP29.4g 12x24 [Dunk Glass] - LMT
B/P Tiger BP 22.5g 24x24 [CP Nestle Bunyad]
B/P Tiger BP 22.5g 24x24 [CP Nestle Bunyad] - LMT
F/P Oreo Original FP Tube 117.6g 1x24 NP216
B/P Tiger BP 22.5g 25x24 [CP]
B/P TUC BP 32g 12x24 [CP TANG]
B/P TUC BP 32g 12x24 [CP TANG] - LMT
F/P Wheatable Sugar Free FP 114g 1x48 [CP]
T/P Prince Chocolate TP 19g 24x24 Automate
GIFT (BOURNVITA JAR)
S/P Bakeri Coconut SP 36g 6x24
S/P Bakeri Butter SP 36g 6x24
B/P Bakeri Bistiks BP 25.6g 12x24
S/P Bakeri Coconut SP 36g 6x24 - LMT
S/P Bakeri Butter SP 36g 6x24 - LMT
B/P Bakeri Bistiks BP 25.6g 12x24 - LMT
Oreo Original BP 29.4g 12x24 [CP McDonald]
Oreo Original BP 29.4g 12x24 [CP McDonald] - LMT
B/P Tiger Fortified 22.5g 24x24
B/P Tiger Fortified 22.5g 24x24 - LMT
Zeera Plus SP 66g 6x24 [CP Vital]
Zeera Plus SP 66g 6x24 [CP Vital] LMT
Oreo Original BP (Lunchbox) 29.4g 12x24
BP Oreo Original (Lunchbox) 29.4g 12x24
Oreo Original BP (Lunchbox) 29.4g 12x24 - LMT
S/P Zeera Plus SP 66g 6x24
S/P Zeera Plus SP 66g 6x24 - LMT
S/P Milco LU SP 45g 6x24
B/P Milco LU BP 30g 12x24
T/P Milco LU TP 15g 24x24
S/P Milco LU SP 45g 6x24 - LMT
B/P Milco LU BP 30g 12x24 - LMT
T/P Milco LU TP 15g 24x24 - LMT
T/P Belvita Bran TP 62g 12x6 - LMT
T/P Belvita Kleija TP 62g 12x6 - LMT
B/P Tiger Fortified BP 22.5g 24x24[N.Bunyad]
B/P Tiger Fortified BP 22.5g 24x24[N.Bunyad] - LMT
S/P Gala Egg SP 57.2g 6x24
S/P Gala Egg SP 57.2g 6x24 - LMT
T/P TUC TP 16g 25x24 [CP]
T/P TUC TP 16g 25x24 [CP] - LMT
B/P Prince Chocolate BP 38g 12x24 [LEP]
B/P Prince Chocolate BP 38g 12x24 [LEP] -LMT
S/P Prince Chocolate SP 57g 6x24 [LEP]
S/P Prince Chocolate SP 57g 6x24 [LEP] - LMT
T/P Prince Chocolate TP 19g 24x24 [LEP]
T/P Prince Chocolate TP 19g 24x24 [LEP] - LMT
S/P Bakeri Nankhatai Big SP 36g 8x24
S/P Bakeri Nankhatai Big SP 36g 8x24 - LMT
B/P Prince Enrobed 20g TP 12x24
B/P Prince Enrobed 20g TP 12x24 - LMT
S/P TUC SP 16g 8x24 [CP LEP Tray]
S/P TUC SP 16g 8x24 [CP LEP Tray] - LMT
S/P Prince Chocolate SP 57g 6x24 NP1118
S/P Prince Chocolate SP 57g 6x24 NP1118 - LMT
T/P Wheatable HF TP 32.4g 12x24(CP-Tapal GT)
T/P Wheatable HF TP 32.4g 12x24(CP-Tapal GT) - LMT
T/P Milco LU TP 15g 25x24 [CP]
T/P Milco LU TP 15g 25x24 [CP] - LMT
S/P Zeera Plus SP 60.5 6x24
S/P Zeera Plus SP 60.5 6x24 - LMT
S/P Gala Egg SP 52g 6x24
S/P Gala Egg SP 52g 6x24 - LMT
S/P Candi Original SP 60g 6x24
S/P Candi Original SP 60g 6x24 - LMT
S/P Prince Chocolate SP 55.2g 6x24
S/P Prince Chocolate SP 55.2g 6x24 - LMT
S/P Prince Chocolate SP 55.2g 6x24 (Auto)
S/P Prince Chocolate SP 55.2g 6x24 (Auto) - LMT
S/P Bakeri Bistiks SP 48g 6x24
S/P Bakeri Bistiks SP 48g 6x24 - LMT
T/P Prince Chocolate TP 18.4g 24x24 (Auto)
T/P Prince Chocolate TP 18.4g 24x24
T/P Prince Chocolate TP 18.4g 24x24 (Auto) - LMT
T/P Prince Chocolate TP 18.4g 24x24 - LMT
B/P Prince Chocolate BP 36.8g 12x24
B/P Prince Chocolate BP 36.8g 12x24 - LMT
F/P Prince Chocolate FP 92g 1x96
F/P Prince Chocolate FP 92g 1x96 - LMT
S/P Bakeri Butter SP 34.2g 6x24
B/P Bakeri Butter BP 22.8g 12x24
S/P Bakeri Butter SP 34.2g 6x24 - LMT
B/P Bakeri Butter BP 22.8g 12x24 - LMT
T/P Bakeri Butter TP 11.4g 24x24
T/P Bakeri Butter TP 11.4g 24x24 - LMT
F/P Bakeri Butter FP 79.8g 1x96
F/P Bakeri Butter FP 79.8g 1x96 - LMT
B/P Bakeri Bistiks BP 24g 12x24
B/P Bakeri Bistiks BP 24g 12x24 - LMT
S/P TUC SP 48g 6x24 [CP +1BP 32g]
S/P Prince Chcolat SP55.8g 6x24[CP+1BP37.2g]
S/P TUC SP 48g 6x24 [CP +1BP 32g] - LMT
S/P Prince Chcolat SP55.8g 6x24[CP+1BP37.2g] - LMT
F/P Bakeri Bistiks FP 84g 1x96
F/P Bakeri Bistiks FP 84g 1x96 - LMT
S/P Bakeri Coconut SP 34.2g 6x24
S/P Bakeri Coconut SP 34.2g 6x24 - LMT
F/P Bakeri Coconut FP 79.8g 1x96
F/P Bakeri Coconut FP 79.8g 1x96 - LMT
T/P Bakeri Coconut TP 11.4g 24x24
T/P Bakeri Coconut TP 11.4g 24x24 - LMT
B/P TUC BP 32g 12x24 [CP Youngs]
B/P TUC BP 32g 12x24 [CP Youngs] - LMT
S/P Zeera Plus SP 60.5 6x24 [CP6+1 MHR33g] - LMT
S/P Zeera Plus SP 60.5 6x24 [CP6+1 MHR33g]
BP Gala Egg BP 31.2 gm 12X24 CP 1Milco BP
S/P Prince Choc SP 55.8g 6x24 [Adventur Box}
S/P Prince Choc SP 55.8g 6x24 [Adventur Box} - LMT
BP Gala Egg BP 31.2 gm 12X24 CP 1Milco BP LMT
S/P Prince Choc SP 55.8g 6x24 [Adventur Box}
S/P Prince Choc SP 55.8g 6x24 [Adventur Box} - LMT
B/P Bakeri Bistiks BP 24g 12x24 +1BP (CP)
B/P Bakeri Bistiks BP 24g 12x24 +1BP (CP) - LMT
T/P Oreo Original TP 19g 24x24
B/P Oreo Original BP 28.5g 12x24
S/P Oreo Original SP 57g 6x24
B/P Prince Chocolate BP 36.8g 12x24
T/P Prince Chocolate TP 18.4g 24x24
T/P Prince Chocolate TP 18.4g 24x24 (Auto)
S/P Prince Chocolate SP 55.2g 6x24
S/P Prince Chocolate SP 55.2g 6x24 (Auto)
F/P Oreo Original FP 114g 1x96
F/P Oreo Original FP Tube 114g 1x24
B/P Oreo Original BP 28.5g 12x24 - LMT
T/P Oreo Original TP 19g 24x24 - LMT
S/P Oreo Original SP 57g 6x24 - LMT
F/P Oreo Original FP 114g 1x96 - LMT
F/P Oreo Original FP Tube 114g 1x24 - LMT
T/P Prince Chocolate TP 18.4g 24x24 (Auto) - LMT
T/P Prince Chocolate TP 18.4g 24x24 - LMT
S/P Prince Chocolate SP 55.2g 6x24 (Auto) - LMT
S/P Prince Chocolate SP 55.2g 6x24 - LMT
B/P Prince Chocolate BP 36.8g 12x24 - LMT
F/P Prince Chocolate FP 92g 1x96 - LMT
F/P Prince Chocolate FP 92g 1x96
S/P Bakeri Nankhatai SP 49g6x24 CP BigNK36g
S/P Bakeri Nankhatai SP 49g6x24 CP BigNK36g - LMT
S/P Oreo Strawberry SP 57g 6x24
B/P Oreo Strawberry BP 28.5g 12x24
S/P Oreo Strawberry SP 57g 6x24 - LMT
B/P Oreo Original BP (Lunchbox) 28.5g 12x24
B/P Oreo Original BP (Lunchbox) 28.5g 12x24 - LMT
B/P Oreo Strawberry BP 28.5g 12x24 - LMT
B/P TUC BP 24g 12x24
T/P TUC TP 12g 24x24
B/P TUC BP 24g 12x24 - LMT
T/P TUC TP 12g 24x24 - LMT
B/P TUC BP CP 24g 12x24 (CP Young's)
B/P TUC BP CP 24g 12x24 (CP Young's) - LMT
T/P Zeera Plus TP (11 g x 24 x 30)
MHR Zeera Plus MHR (22 g x 12 x 30)
T/P Zeera Plus TP (11 g x 24 x 30) - LMT
MHR Zeera Plus MHR (22 g x 12 x 30) - LMT
S/P Zeera Plus SP (60.5 x 6 x 24)
S/P Zeera Plus SP (60.5 x 6 x 24) - LMT
F/P Zeera Plus FP (126.5 x 96)
F/P Zeera Plus FP (126.5 x 96) - LMT
MHR Zeera Plus MHR (22 g x 13 x 30) [CP]
T/P Zeera Plus TP (11 g x 25 x 30) [CP]
MHR Zeera Plus MHR (22 g x 13 x 30) [CP] - LMT
T/P Zeera Plus TP (11 g x 25 x 30) [CP] - LMT
In active
B/P Oreo Original BP 28.5g 13x24 [CP)
B/P Oreo Original BP 28.5g 13x24 [CP] - LMT
T/P Candi Original TP 12g 24x30
MHR Candi Original MHR 24g 12x30
T/P Gala Egg TP 10.4g 24x30
BP Gala Egg BP 20.8g 12x 30
T/P Gala Egg TP 10.4g 24x30 - LMT
T/P Candi Original TP 12g 24x30 - LMT
BP Gala Egg BP 20.8g 12x 30 LMT
MHR Candi Original MHR 24g 12x30 - LMT
T/P Gala Egg TP 10.4g 26x30 [CP]
T/P Candi Original TP 12g 26x30 [CP]
BP Gala Egg BP 20.8g 13x30 CP
MHR Candi Original MHR 24g 13x30 [CP]
T/P Gala Egg TP 10.4g 26x30 [CP] - LMT
T/P Candi Original TP 12g 26x30 [CP] - LMT
BP Gala Egg BP 20.8g 13x30 CP LMT
MHR Candi Original MHR 24g 13x30 [CP] - LMT
S/P TUC SP 48g 6x24 [CP+1 Oreo Strwbry28.5g]
S/P TUC SP 48g 6x24 [CP+1 Oreo Strwbry28.5g] - LMT
B/P Prince Enrobed 16.5g TP 12x24
B/P Prince Enrobed 16.5g TP 12x24 - LMT
S/P Zeera SP 60.5g 6x24- ND [CPTapal Danedar]
S/P Zeera SP 60.5g 6x24- ND [CP Vital]
MHR Zeera MHR 22g 12x30- ND [CPTapal Mezban]
S/P TUC SP 48g 6x24 [NP1019]
S/P Bakeri Butter SP 34.2g 6x24 [NP1019]
S/P Bakeri Bistiks SP 48g 6x24 [NP1019]
S/P Zeera Plus SP 60.5g 6x24 [NP 1019]
S/P Bakeri Coconut SP 34.2g 6x24 [NP1019]
S/P Gala Egg SP 52g 6x24 [NP1019]
S/P Candi Original SP 60g 6x24 [NP1019]
S/P Bakeri Nankhatai SP 49g 6x24 [NP1019]
S/P Zeera SP 60.5g 6x24- ND [CPTapal Danedar] - LMT
S/P Zeera SP 60.5g 6x24- ND [CP Vital] - LMT
MHR Zeera MHR 22g 12x30- ND [CPTapal Mezban] - LMT
S/P TUC SP 48g 6x24 [NP1019] - LMT
S/P Zeera Plus SP 60.5g 6x24 [NP 1019] - LMT
S/P Gala Egg SP 52g 6x24 [NP1019] - LMT
S/P Candi Original SP 60g 6x24 [NP1019] - LMT
S/P Bakeri Nankhatai SP 49g 6x24 [NP1019] - LMT
S/P Bakeri Coconut SP 34.2g 6x24 [NP1019] - LMT
S/P Bakeri Butter SP 34.2g 6x24 [NP1019] - LMT
S/P Bakeri Bistiks SP 48g 6x24 [NP1019] - LMT
T/P Oreo Original TP 19g 24x24
T/P Oreo Original TP 19g 24x24 - LMT
S/P Prince Chocolate SP 52.8g 6x24 CAMA
T/P Prince Chocolate TP 17.6g 24x24
B/P Prince Chocolate BP 35.2g 12x24
T/P Prince Chocolate TP 17.6g 24x24 -LMT
T/P Prince Chocolate TP 17.6g 24x24 CAMA
S/P Prince Chocolate SP 52.8g 6x24
F/P Wheatable SF FP 114g 1x48 [CP Lipton]
F/P Wheatable HF FP 129.6g 1x48 [CP Lipton]
F/P Wheatable HF FP 129.6g 1x48 [CP Lipton] - LMT
F/P Wheatable SF FP 114g 1x48 [CP Lipton] - LMT
T/P Prince Chocolate TP 17.6g 24x24 CAMA - LMT
S/P Prince Chocolate SP 52.8g 6x24 - LMT
S/P Prince Chocolate SP 52.8g 6x24 CAMA - LMT
B/P Prince Chocolate BP 35.2g 12x24 - LMT
F/P Prince Chocolate FP 88g 1x96
F/P Prince Chocolate FP 88g 1x96 - LMT
B/P Prince Choco Jammies BP 20g 15 x 24
B/P Prince Choco Jammies BP 20g 15 x 24 - LMT
S/P TUC SP 48g 6x24 [CP+1 Oreo Strwbry28.5g]- NP
S/P TUC SP 48g 6x24 [CP+1 Oreo Strwbry28.5g]- NP - LMT
S/P Prince Chocolate SP 52.8g 6x24 [NP 1219]
S/P Prince Chocolate SP 52.8g 6x24 CAMA [NP 1219]
S/P TUC SP 48g 6x24 [NP 1219]
S/P Zeera Plus SP 60.5g 6x24 [NP 1219]
S/P Gala Egg SP 52g 6x24 [NP 1219]
S/P Candi Original SP 60g 6x24 [NP 1219]
S/P Zeera Plus SP 60.5g 6x24 [NP 1219] - LMT
S/P Gala Egg SP 52g 6x24 [NP 1219] - LMT
S/P Candi Original SP 60g 6x24 [NP 1219] - LMT
S/P TUC SP 48g 6x24 [NP 1219] - LMT
S/P Prince Chocolate SP 52.8g 6x24 [NP 1219] - LMT
S/P Prince Chocolate SP 52.8g 6x24 CAMA [NP 1219] - LMT
S/P TUC SP 48g 6x24 [CP 6+1TP]
S/P Zeera Plus SP 60.5g 6x24 [CP 6+1 TP]
S/P Candi Original SP 60g 6x24 [CP 6+1 TP]
S/P Milco LU SP 45g 6x24 [CP 6+1 BP]
T/P Candi Original TP 12g 25x30 [CP]
B/P TUC BP 24g 12x24 [CP 12+1TP]
2
1
S/P Gala Egg SP 52 6x24 [CP 6+1 TP]
B/P Tiger Fortified TP 18g 25x30 [CP]
T/P TUC TP 12g 25x24 [CP]
T/P Gala Egg TP 10.4g 25x30 [CP]
BP Gala Egg BP 20.8g 12x30 CP 12 1 TP
MHR Zeera Plus MHR 22g 12x30 [CP12+1 TP]
MHR Candi MHR 24g 12x30 [CP 12+1 TP]
S/P Zeera Plus SP 60.5g 6x24 [CP 6+1 TP] - LMT
S/P Milco LU SP 45g 6x24 [NP0120]
MHR Candi Original HR 36g 8x30
BP Gala Egg HR 31.2g 8x30
MHR Zeera Plus HR 33g 8x30
S/P TUC SP 48g 6x24 [CP 6+1TP] - LMT
S/P Candi Original SP 60g 6x24 [CP 6+1 TP] - LMT
S/P Gala Egg SP 52 6x24 [CP 6+1 TP] - LMT
B/P Oreo Original BP 27.9g 12x24
S/P Oreo Original SP 55.8g 6x24
T/P Oreo Original TP 18g 24x24
F/P Oreo Original FP 111.6g 1x96
T/P Oreo Original TP 18g 24x24 - LMT
B/P Oreo Original BP 27.9g 12x24 - LMT
S/P Oreo Original SP 55.8g 6x24 - LMT
F/P Oreo Original FP 111.6g 1x96 - LMT
S/P Oreo Strawberry SP 55.8g 6x24
B/P Oreo Strawberry BP 27.9g 12x24
S/P Oreo Strawberry SP 55.8g 6x24 - LMT
B/P Oreo Strawberry BP 27.9g 12x24 - LMT
F/P Oreo Original FP Tube 111.6g 1x24
F/P Oreo Original FP Tube 111.6g 1x24 - LMT
S/P Milco LU SP 45g 6x24 [CP 6+1 BP] - LMT
T/P TUC TP 12g 25x24 [CP] - LMT
T/P Gala Egg TP 10.4g 25x30 [CP] - LMT
T/P Candi Original TP 12g 25x30 [CP] - LMT
B/P TUC BP 24g 12x24 [CP 12+1TP] - LMT
BP Gala Egg BP 20.8g 12x30 CP 12 1 TP LMT
MHR Zeera Plus MHR 22g 12x30 [CP12+1 TP] - LMT
MHR Candi MHR 24g 12x30 [CP 12+1 TP] - LMT
B/P Tiger Fortified BP 18g 25x30 [CP]
B/P Tiger Fortified BP 18g 25x30 [CP] - LMT
S/P Tiger Fortified SP 36g 12x30
B/P Tiger Fortified BP 18g 24x30
S/P Tiger Fortified SP 36g 12x30 - LMT
B/P Tiger Fortified BP 18g 24x30 - LMT
S/P Candi Original HR 36g 8x30 - LMT
S/P Gala Egg HR 31.2g 8x30 - LMT
S/P Zeera Plus HR 33g 8x30 - LMT
S/P Prince Chocolate SP52.8g6x24 CAMA [LEP]
S/P Prince Chocolate SP 52.8g 6x24 [LEP]
B/P Prince Chocolate BP 35.2g 12x24 [LEP]
T/P Prince Chocolate TP17.6g 24x24 CAMA [LEP]
T/P Prince Chocolate TP 17.6g 24x24 [LEP]
S/P Prince Chocolate SP52.8g6x24 CAMA [LEP] - LMT
S/P Prince Chocolate SP 52.8g 6x24 [LEP] - LMT
B/P Prince Chocolate BP 35.2g 12x24 [LEP] - LMT
T/P Prince Chocolate TP17.6g 24x24CAMA [LEP] - LMT
T/P Prince Chocolate TP 17.6g 24x24 [LEP] - LMT
T/P Oreo Mini Chocolate TP 14.5g 24x24
T/P Oreo Mini Strawberry TP 14.5g 24x24
T/P Oreo Mini Original TP 14.5g 24x24
B/P Oreo Mini Chocolate BP 29g 12x24
B/P Oreo Mini Strawberry BP 29g 12x24
B/P Oreo Mini Original BP 29g 12x24
B/P Oreo Mini Original BP 29g 12x24 - LMT
B/P Oreo Mini Strawberry BP 29g 12x24 - LMT
B/P Oreo Mini Chocolate BP 29g 12x24 - LMT
T/P Oreo Mini Original TP 14.5g 24x24 - LMT
T/P Oreo Mini Strawberry TP 14.5g 24x24 - LMT
T/P Oreo Mini Chocolate TP 14.5g 24x24 - LMT
S/P TUC SP 48g 6x24 [CP TANG]
B/P TUC BP 24g 12x24 [CP TANG]
BP Gala EGG BP 20.8g 12x30 CPScratch Win
B/P Zeera Plus BP 22g 12x30 CP[Scratch&Win]
B/P Candi Original BP24g12x30 CP[ScratchWin]
T/P Gala EGG TP 10.4g 24x30 CP [Scratch&Win]
T/P Candi Original TP 12g24x30 CP[ScratchWin
T/P Zeera Plus TP 11g 24x30 CP[Scratch&Win] w
S/P TUC SP 48g 6x24 [CP TANG] - LMT
B/P TUC BP 24g 12x24 [CP TANG] - LMT
B/P Mini Oreo Original BP 27g 12x24
B/P Mini Oreo Original BP 27g 12x24 - LMT
B/P Mini Oreo Strawberry BP 27g 12x24
B/P Mini Oreo Chocolate BP 27g 12x24
T/P Mini Oreo Original TP 13.5g 24x24
T/P Mini Oreo Strawberry TP 13.5g 24x24
T/P Mini Oreo Chocolate TP 13.5g 24x24
B/P Mini Oreo Strawberry BP 27g 12x24 - LMT
B/P Mini Oreo Chocolate BP 27g 12x24 - LMT
T/P Mini Oreo Original TP 13.5g 24x24 - LMT
T/P Mini Oreo Strawberry TP 13.5g 24x24 - LMT
T/P Mini Oreo Chocolate TP 13.5g 24x24 - LMT
B/P Prince Chocolate BP 34.4g 12x24
T/P Prince Chocolate TP 17.2g 24x24
T/P Prince Chocolate TP 17.2g 24x24 CAMA
S/P Prince Chocolate SP 51.6g 6x24 CAMA
F/P Prince Chocolate FP 86g 1x96 - LMT
S/P Prince Chocolate SP 51.6g 6x24 - LMT
S/P Prince Chocolate SP 51.6g 6x24 CAMA - LMT
B/P Prince Chocolate BP 34.4g 12x24 - LMT
T/P Prince Chocolate TP 17.2g 24x24 - LMT
T/P Prince Chocolate TP 17.2g 24x24 CAMA - LMT
F/P Bakeri Bistiks FP 81.2g 1x96
S/P Bakeri Bistiks SP 40.6g 6x24
B/P Bakeri Bistiks BP 23.2g 12x24
F/P Bakeri Nan Khatai FP 81.6g 1x96
S/P Bakeri Nan Khatai SP 47.6g 6x24
B/P Bakeri Nan Khatai BP 27.2g 12x24
T/P Bakeri Nan Khatai TP 13.6g 24x24
F/P Bakeri Coconut FP 77g 1x96
S/P Bakeri Coconut SP 33g 6x24
T/P Bakeri Coconut TP 11g 24x24
S/P Prince Chocolate SP 51.6g 6x24
F/P Prince Chocolate FP 86g 1x96
F/P Bakeri Butter FP 77g 1x96
S/P Bakeri Butter SP 33g 6x24
B/P Bakeri Butter BP 22g 12x24
T/P Bakeri Butter TP 11g 24x24
S/P Prince Chocolate SP 51.6g 6x24 [LEP]
B/P Prince Chocolate BP 34.4g 12x24 [LEP]
S/P Prince Chocolate SP 51.6g 6x24 [LEP] - LMT
B/P Prince Chocolate BP 34.4g 12x24 [LEP] - LMT
B/P Bakeri Butter BP 22g 12x24 - LMT
S/P Bakeri Butter SP 33g 6x24 - LMT
S/P Bakeri Coconut SP 33g 6x24 - LMT
S/P Bakeri Bistiks SP 40.6g 6x24 - LMT
S/P Bakeri Nan Khatai SP 47.6g 6x24 - LMT
B/P Bakeri Bistiks BP 23.2g 12x24 - LMT
B/P Bakeri Nan Khatai BP 27.2g 12x24 - LMT
T/P Bakeri Coconut TP 11g 24x24 - LMT
T/P Bakeri Nan Khatai TP 13.6g 24x24 - LMT
TP Bakeri Butter TP 11g 24x24 - LMT
F/P Bakeri Butter FP 77g 1x96 - LMT
F/P Bakeri Bistiks FP 81.2g 1x96 - LMT
F/P Bakeri Nan Khatai FP 81.6g 1x96 - LMT
F/P Bakeri Coconut FP 77g 1x96 - LMT
S/P Milco LU SP 45g 6x24 [NP0120] - LMT
S/P Oreo Original SP 54g 6x24
S/P Oreo Original SP 54g 6x24 - LMT
B/P Oreo Original BP 27g 12x24
B/P Oreo Original BP 27g 12x24 - LMT
S/P Peanut Maza SP 60g 6x24
B/P Peanut Maza BP 30g 12x24
T/P Peanut Maza TP 15g 24x24
F/P Oreo Original FP 108g 1x96
F/P Oreo Original FP Tube 108g 1x24
F/P Wheatable HighFiber FP129.6g 1x48 [NP0420]
F/P Wheatable Sugar Free FP114g 1x48 [NP0420]
B/P Oreo Original TP 18g 20x24 CP[School P] - LMT
F/P Wheatable HighFiber FP129.6g 1x48 [NP0420] - LMT
F/P Wheatable Sugar Free FP114g 1x48 [NP0420] - LMT
F/P Oreo Original FP 108g 1x96 - LMT
F/P Oreo Original FP Tube 108g 1x24 - LMT
T/P Prince Chocolate TP 16.8g 24x24
T/P Prince Chocolate TP 16.8g 24x24 [CAMA]
S/P Prince Chocolate SP 50.4g 6x24 [CAMA]
T/P Oreo Original TP 18g 20x24 CP[School P]
B/P Prince Chocolate BP 33.6g 12x24
F/P Prince Chocolate FP 85.5g 1x96 [E] Afg
B/P Prince Chocolate BP 33.6g 12x24 - LMT
S/P Peanut Maza SP 60g 6x24 - LMT
B/P Peanut Maza BP 30g 12x24 - LMT
T/P Peanut Maza TP 15g 24x24 - LMT
S/P Prince Chocolate SP 50.4g 6x24
T/P Prince Chocolate TP 16.8g 24x24 [CAMA] - LMT
T/P Prince Chocolate TP 16.8g 24x24 -+ LMT
S/P Prince Chocolate SP 50.4g 6x24 [CAMA] - LMT
S/P Prince Chocolate SP 50.4g 6x24 - LMT
T/P Zeera Plus TP 11g 24x30 CP[Scratch&Win]
T/P Gala EGG TP 10.4g 24x30 CP [Scratch&Win] - LMT
T/P Candi Original TP 12g24x30 CP[ScratchWin - LMT
B/P Oreo Strawberry BP 27g 13x24 [CP]
B/P Oreo Strawberry BP 27g 13x24 [CP] - LMT
T/P Zeera Plus TP 11g 24x30 CP[Scratch&Win] - LMT
BP Gala EGG BP 20.8g 12x30 CPScratch Win LMT
B/P Zeera Plus BP 22g 12x30 CP[Scratch&Win] - LMT
B/P Candi Original BP24g12x30 CP[ScratchWin] - LMT
T/P Mini Oreo Original TP 12.5g 24x24
T/P Mini Oreo Original TP 12.5g 24x24 - LMT
T/P Mini Oreo Chocolate TP 12.5g 24x24
B/P Mini Oreo Chocolate BP 25g 12x24
B/P Mini Oreo Chocolate BP 25g 12x24 - LMT
T/P Mini Oreo Chocolate TP 12.5g 24x24 - LMT
B/P Mini Oreo Original BP 25g 12x24
B/P Mini Oreo Original BP 25g 12x24 - LMT
B/P Oreo Original BP 27g 13x24 [CP]
B/P Oreo Original BP 27g 13x24 [CP] - LMT
F/P Prince Chocolate FP 85g 1x96
S/P Prince Chocolate SP 51g 6x24 (Manual)
S/P Prince Chocolate CAMA SP 51g 6x24
B/P Prince Chocolate BP 34g 12x24
T/P Prince Chocolate TP 17g 24x24 (Manual)
T/P Prince Chocolate CAMA TP 17g 24x24
F/P Prince Chocolate FP 85g 1x96 -LMT
S/P Prince Chocolate SP 51g 6x24 (Manual) -LMT
S/P Prince Chocolate CAMA SP 51g 6x24- LMT
B/P Prince Chocolate BP 34g 12x24 -LMT
T/P Prince Chocolate TP 17g 24x24 (Manual) -LMT
T/P Prince Chocolate CAMA TP 17g 24x24 -LMT
T/P Mini Oreo Strawberry TP 12.5g 24x24
T/P Mini Oreo Strawberry TP 12.5g 24x24 - LMT
B/P Mini Oreo Strawberry BP 25g 12x24
B/P Mini Oreo Strawberry BP 25g 12x24 - LMT
T/P Oreo Crispy TP 14.4g 24x24
T/P Oreo Crispy TP 14.4g 24x24 - LMT
F/P Prince Chocolate FP 84g 1x96
F/P Prince Chocolate FP 84g 1x96 - LMT
S/P Zeera Plus SP 59.4g 6x24
B/P Oreo Strawberry BP 27g 12x24
S/P Oreo Strawberry SP 54g 6x24
S/P Zeera Plus SP 59.4g 6x24 - LMT
MHR Zeera Plus BP 21.6g 12x30
T/P Zeera Plus TP 10.8g 24x30
F/P Zeera Plus FP 118.8g 1x96
F/P Zeera Plus FP 118.8g 1x96 - LMT
MHR Zeera Plus BP 21.6g 12x30 - LMT
T/P Zeera Plus TP 10.8g 24x30 - LMT
S/P Oreo Strawberry SP 54g 6x24 - LMT
B/P Oreo Strawberry BP 27g 12x24 - LMT
B/P Tiger Fortified BP 17.1g 24x30
B/P Tiger Fortified BP 17.1g 24x30 - LMT
S/P Candi Original SP 59g 6x24
S/P Candi Original SP 59g 6x24 - LMT
F/P Candi Original FP 100.3g 1x96
F/P Candi Original FP 100.3g 1x96 - LMT
S/P Zeera Plus SP59.4g6x24[CP+1Mini Oreo12.5 - LMT
MHR Candi Original BP 23.6g 12x30
T/P Candi Original TP 11.8g 24x30
Wromg packaging
T/P Candi Original TP 11.8g 24x30 - LMT
S/P Gala Egg SP 51g 6x24
BP Gala EGG BP 20.4g 12x 30
MHR Candi Original BP 23.6g 12x30 - LMT
T/P Gala EGG TP 10.2g 24x30
S/P Bakeri Butter SP 33g 6x24 [NP0820]
S/P Gala Egg SP 51g 6x24 - LMT
BP Gala EGG BP 20.4g 12x 30 LMT
T/P Gala EGG TP 10.2g 24x30 - LMT
S/P Bakeri Butter SP 33g 6x24 [NP0820] - LMT
F/P Gala Egg FP 107.1g 1x96
F/P Gala Egg FP 107.1g 1x96 - LMT
S/P Zeera Plus SP59.4g6x24[CP+1Mini Oreo12.5
S/P Bakeri Coconut SP 33g 6x24 [NP0820]
S/P Bakeri Coconut SP 33g 6x24 [NP0820] - LMT
S/P Tiger Fortified SP 34.2g 12x30
S/P Tiger Fortified SP 34.2g 12x30 - LMT
S/P TUC SP 46.8g 6x24
S/P TUC SP 46.8g 6x24 - LMT
B/P TUC BP 23.4g 12x24
T/P TUC TP 11.7g 24x24
B/P TUC BP 23.4g 12x24 - LMT
T/P TUC TP 11.7g 24x24 - LMT
T/P Mini Oreo Original TP 10g - LMT
T/P Mini Oreo Original TP 10g
S/P Zeera Plus SP 59.4g 6x24- [CP Vital tea]
S/P Zeera Plus SP 59.4g 6x24- [CP Vital tea] - LMT
F/P TUC FP 81.9g 1 x 96
F/P TUC FP 81.9g 1 x 96 - LMT
S/P Prince Chocolate CAMA SP 49.2g 6x24
T/P Prince Chocolate CAMA TP 16.4g 24x24
T/P Prince Chocolate TP 16.4g 24x24 (Manual)
B/P Prince Chocolate BP 32.8g 12x24
S/P Zeera Plus SP59.4g6x24[CP+OreoCrispy14.4
S/P Zeera Plus SP59.4g6x24[CP+OreoCrispy14.4 - LMT
S/P Zeera Plus SP 59.4g 6x24 [CP+ 1TP 10.8g]
S/P Zeera Plus SP 59.4g 6x24 [CP+ 1TP 10.8g] - LMT
S/P Prince Chocolate SP 49.2g 6x24 (Manual)
S/P Prince Chocolate SP 49.2g 6x24 (Manual) - LMT
S/P Prince Chocolate CAMA SP 49.2g 6x24 - LMT
T/P Prince Chocolate CAMA TP 16.4g 24x24 - LMT
T/P Prince Chocolate TP 16.4g 24x24 (Manual) - LMT
B/P Prince Chocolate BP 32.8g 12x24 - LMT
S/P Bakeri NanKhatai SP 47.6g 6x24[CP+TP13.6
S/P Bakeri NanKhatai SP 47.6g 6x24[CP+TP13.6 - LMT
F/P Prince Chocolate FP 82g 1x96 - LMT
F/P Prince Chocolate FP 82g 1x96
S/P Bakeri Coconut SP 33g 6x24 [CP+1TP 11g]
S/P Bakeri Coconut SP 33g 6x24 [CP+1TP 11g] - LMT
MHR Zeera Plus BP 21.6g 12x30 [CP+1TP10.8]
T/P Zeera Plus TP 10.8g 25 x 30 [CP+1]
MHR Zeera Plus BP 21.6g 12x30 [CP+1TP10.8] - LMT
T/P Zeera Plus TP 10.8g 25 x 30 [CP+1] - LMT
B/P TUC BP 23.4g 12x24 [CP TANG]
B/P TUC BP 23.4g 12x24 [CP TANG] - LMT
S/P TUC SP 46.8g 6x30 [CP+1TP 11.7g]
B/P TUC BP 23.4g 12x24 [CP+1TP 11.7g]
S/P TUC SP 46.8g 6x30 [CP+1TP 11.7g] - LMT
B/P TUC BP 23.4g 12x24 [CP+1TP 11.7g] - LMT
S/P Bakeri Butter SP 33g 6x24 [CP+1TP11g] - LMT
S/P Bakeri Butter SP 33g 6x24 [CP+1TP11g]
T/P Mini Oreo Chocolate TP 10g 24x24
T/P Mini Oreo Chocolate TP 10g 24x24 - LMT
S/P Tiger SP g 34.2g 12x30 CP Nestle Bunyad
S/P Tiger SP g 34.2g 12x30 CP Nestle Bunyad - LMT
S/P Bakeri Nan Khatai SP 47.6g 6x24 [NP0920]
S/P Bakeri Nan Khatai SP 47.6g 6x24 [NP0920] - LMT
S/P TUC SP 46.8g 6x30 (WRONG)
S/P TUC SP 46.8g 6x30 - LMT (WRONG)
T/P TUC TP 11.7g 24x24 -ND - LMT
T/P TUC TP 11.7g 24x24 -ND
F/P TUC FP 81.9g 1 x 96 -ND
S/P TUC SP 46.8g 6x30
S/P TUC SP 46.8g 6x30 - LMT
T/P Mini Oreo Strawberry TP 10g 24x24
T/P Mini Oreo Strawberry TP 10g 24x24 - LMT
S/P Gala Egg SP 51g 6x24 [ND]
S/P Gala Egg SP 51g 6x24 [ND] - LMT
B/P Prince Chocolate BP 32.8g 12x24 LEP
B/P Prince Chocolate BP 32.8g 12x24 LEP - LMT
BP Gala EGG BP 20.4g 12x 30 ND
BP Gala EGG BP 20.4g 12x 30 ND LMT
B/P TUC BP 23.4g 12x24 -ND
B/P TUC BP 23.4g 12x24 -ND - LMT
T/P Prince Chocolate TP 16.4g 24x24 LEP
T/P Prince Chocolate TP 16.4g 24x24 LEP - LMT
T/P Gala EGG TP 10.2g 24x30 [ND]
T/P Gala EGG TP 10.2g 24x30 [ND] - LMT
F/P Gala Egg FP 107.1g 1x96 [ND]
F/P Gala Egg FP 107.1g 1x96 [ND] - LMT
F/P TUC FP 81.9g 1 x 96 -ND - LMT
B/P Mini Oreo Original BP 22.5g 12x24
B/P Oreo Mini BP Original 22.5g 12x24 - LMT
S/P Prince Chocolate SP 49.2g 6x24 LEP
S/P Prince Chocolate SP 49.2g 6x24 LEP - LMT
S/P Wheatable High Fiber SP 64.8g6x24[NP0820
S/P Wheatable Sugar Free SP 57g 6x24[NP0820]
S/P Wheatable High Fiber SP 64.8g6x24[NP0820 - LMT
S/P Wheatable Sugar Free SP 57g 6x24[NP0820] - LMT
B/P Tiger Fortified BP 17.1g 24x30 CPNBunyad
B/P Tiger Fortified BP 17.1g 24x30 CPNBunyad - LMT
B/P Mini Oreo Chocolat BP 22.5g 13x24[CP12+1
B/P Mini Oreo Chocolat BP 22.5g 13x24[CP12+1 - LMT
S/P Zeera Plus SP 59.4g 6x24 [CP- Danedar]
S/P Zeera Plus SP 59.4g 6x24 [CP- Danedar] - LMT
B/P Mini Oreo Straw BP 22.5g 13x24 [CP12+1BP]
B/P Mini Oreo Straw BP 22.5g 13x24 [CP12+1BP] - LMT
S/P Zeera Plus SP 59.4g 6x24 [CP - Mezban]
S/P Zeera Plus SP 59.4g 6x24 [CP - Mezban] - LMT
S/P Zeera Plus SP 59.4g 6x24 [CP-Family Mix]
S/P Zeera Plus SP 59.4g 6x24 [CP-Family Mix] - LMT
S/P TUC SP 46.8g 6x30 [CP Young's]
S/P TUC SP 46.8g 6x30 [CP Young's] - LMT WRONG
B/P TUC BP 23.4g 12x24 [CP Young's]
B/P TUC BP 23.4g 12x24 [CP Young's] - LMT
S/P Zeera Plus SP 59.4 6x24 [CP - Tezdum]
S/P Zeera Plus SP 59.4 6x24 [CP - Tezdum] - LMT
BP Gala EGG BP 20.4g 12x 30 Tarang CP
OREO Crumbs 1000g x 10
OREO Crumbs 1000g x 10 - LMT
BP Gala EGG BP 20.4g 12x 30 Tarang CP LMT
S/P TUC SP 46.8g 6x30 [CP Young's] - LMT
B/P Bakeri Bistiks BP 22.0G 12x24
S/P Bakeri Bistiks SP 38.5g 6x24
S/P Bakeri Bistiks SP 38.5g 6x24 - LMT
B/P Bakeri Bistiks BP 22.0G 12x24 - LMT
S/P Candi Original SP 59g 6x24 [CP Nescafe]
S/P Candi Original SP 59g 6x24 [CP Nescafe] - LMT
F/P Wheatable SF FP 114g 1x48 [CP Canderel]
F/P Wheatable SF FP 114g 1x48 [CP Canderel] - LMT
B/P Mini Oreo Chocolate BP 22.5g 12x24
B/P Mini Oreo Chocolate BP 22.5g 12x24 - LMT
F/P Bakeri Bistiks FP 77g 1x96
F/P Bakeri Bistiks FP 77g 1x96 - LMT
B/P Mini Oreo Original BP 22.5g 13x24[CP12+1
B/P Mini Oreo Original BP 22.5g 13x24[CP12+1 - LMT
B/P Mini Oreo Strawberry BP 22.5g 12x24
B/P Oreo Mini BP Strawberry 22.5g 12x24 - LMT
S/P Peanut Maza SP 56.4g 6x24
B/P Peanut Maza BP 28.2g 12x24
T/P Peanut Maza TP 14.1g 24x24
S/P Peanut Maza SP 56.4g 6x24 - LMT
B/P Peanut Maza BP 28.2g 12x24 - LMT
T/P Peanut Maza TP 14.1g 24x24 - LMT
S/P Tuc SP 45.6 6x30
S/P Tuc SP 45.6 6x30 - LMT
S/P Prince Chocolate CAMA SP 49.2g 6x24 NP0121
S/P Prince Chocolate CAMA SP 49.2g 6x24 NP0121 - LMT
B/P Prince Chocolate BP 24.6g 12x24
B/P Prince Chocolate BP 24.6g 12x24 - LMT
B/P TUC BP 22.8g 12x24
B/P TUC BP 22.8g 12x24 - LMT
B/P Tiger BP 15g 24x30
B/P Tiger BP 15g 24x30 - LMT
F/P TUC FP 79.8g 1x96
T/P TUC TP 11.4g 24x24
F/P TUC FP 79.8g 1x96 - LMT
T/P TUC TP 11.4g 24x24 - LMT
S/P Bakeri Bistiks SP 38.5g 6x24 [NP0121]
S/P Bakeri Bistiks SP 38.5g 6x24 [NP0121] - LMT
B/P Bakeri Bistiks BP 16.5g 12x24
B/P Bakeri Bistiks BP 16.5g 12x24 - LMT
S/P Oreo Original SP 52.8g 6x24
S/P Oreo Original SP 52.8g 6x24 - LMT
S/P Prince Chocolate SP 48g 6x24 [Edge]CAMA
S/P Prince Chocolate SP 48g 6x24 [Edge]CAMA - LMT
S/P Prince Mini Fingers SP 34.6g 6x24 Rs20
B/P Prince Mini Fingers BP 17.3g 12x24 Rs10
S/P Prince Mini Fingers SP 34.6g 6x24 Rs20 - LMT
B/P Prince Mini Fingers BP 17.3g 12x24 Rs10 - LMT
T/P Junior Prince TP 12g 24x24
T/P Junior Prince TP 12g 24x24 - LMT
B/P Tiger Alpha AtoZ BP 22g 12x24 Rs 10 - LMT
T/P Tiger Alpha AtoZ TP 11g 24x24 Rs 5 - LMT
B/P Tiger Alpha AtoZ BP 22g 12x24 Rs 10
T/P Tiger Alpha AtoZ TP 11g 24x24 Rs 5
S/P Tiger SP 30g 12x30
F/P Prince Chocolate FP 72g 1x96
F/P Prince Chocolate FP 72g 1x96 - LMT
S/P Tiger SP 30g 12x30 - LMT
S/P Oreo Original SP 52.8g 6x24 [CP 6+1BP]
S/P Oreo Original SP 52.8g 6x24 [CP 6+1BP] - LMT
B/P Oreo Original BP 26.4g 13x24 [CP]
B/P Oreo Original BP 26.4g 13x24 [CP] - LMT
F/P Bakeri Coconut FP 66g 1x96
F/P Bakeri Coconut FP 66g 1x96 - LMT
F/P Gala Egg FP 102g 1x96
F/P Gala Egg FP 102g 1x96 - LMT
b/p Bakeri Butter BP 16.5g 12x24
B/P Bakeri Butter BP 16.5g 12x24 LMT
F/P Zeera Plus FP 108g 1x96
F/P Zeera Plus FP 108g 1x96 LMT
S/P Bakeri Butter SP 33g 6x24 wo Tray
S/P Bakeri Butter SP 33g 6x24 wo Tray LMT
B/P Bakeri Butter BP 16.5g 12x24
B/P Bakeri Butter BP 16.5g 12x24 LMT
S/P Bakeri Butter SP 33g 6x24 wo Tray
S/P Bakeri Butter SP 33g 6x24 wo Tray LMT
S/P Prince Chocolate SP 48g 6x24 [Bar]Manual
S/P Prince Chocolate SP 48g 6x24 [Bar]Manual LMT
F/P Bakeri Butter FP 66g 1x96
F/P Bakeri Butter FP 66g 1x96 LMT
B/P Milco LU BP 22.5g 12x24
B/P Milco LU BP 22.5g 12x24 LMT
T/P Oreo Crispy TP 13g 24x24
B/P Oreo Original BP 26.4g 12x24
S/P Milco LU SP 45g 6x24 NP0121 [CP6+1BP]
S/P Milco LU SP 45g 6x24 NP0121 [CP6+1BP] - LMT
S/P TUC SP 45.6g 6x30 CP S&W
S/P TUC SP 45.6g 6x30 CP S&W - LMT
B/P TUC BP 22.8g 12x24 CP S&W
B/P TUC BP 22.8g 12x24 CP S&W - LMT
S/P Bakeri Nan Khatai SP 47.6g 6x24 CP S&W
S/P Bakeri Nan Khatai SP 47.6g 6x24 CP S&W - LMT
T/P Oreo Crispy TP 13g 24x24 CP Drawing Book
T/P Oreo Crispy TP 13g 24x24 CP Drawing Book - LMT
S/P Candi Original SP 59g 6x24 CP S&W
F/P Bakeri Bistiks FP 71.5g 1x96
B/P Prince Chocolate BP 32g 12x24 CP S&W
S/P Oreo Original SP 52.8g 6x24 CP S&W
B/P Tiger BP 15g 24x30 CP S&W
B/P Bakeri Nan Khatai BP 27.2g 12x24 CP S&W
S/P Bakeri Bistiks SP 38.5g 6x24 CP S&W
B/P Prince Chocolate BP 32g 12x24 CP S&W LMT
B/P Oreo Original BP 26.4g 12x24 CP S&W
B/P Bakeri Bistiks BP 16.5g 12x24 CP S&W
S/P Oreo Original SP 52.8g 6x24 CP S&W - LMT
S/P Candi Original SP 59g 6x24 CP S&W - LMT
B/P Candi Original BP 23.6g 12x30 CP S&W - LMT
B/P Candi Original BP 23.6g 12x30 CP S&W
S/P Zeera Plus SP 59.4g 6x24 CP S&W
MHR Zeera Plus BP 21.6g 12x30 CP S&W
S/P Prince Chocolate SP 48g 6x24 [Edge]Manual
S/P Tiger Fortified SP 30g 12x30 [CPNBunyad]
F/P Bakeri Bistiks FP 71.5g 1x96 - LMT
S/P Bakeri Bistiks SP 38.5g 6x24 CP S&W - LMT
S/P Zeera Plus SP 59.4g 6x24 CP S&W - LMT
B/P Tiger BP 15g 24x30 CP S&W - LMT
B/P Bakeri Bistiks BP 16.5g 12x24 CP S&W - LMT
B/P Bakeri Nan Khatai BP 27.2g 12x24 CP S&W - LMT
MHR Zeera Plus BP 21.6g 12x30 CP S&W - LMT
B/P Oreo Original BP 26.4g 12x24 CP S&W - LMT
S/P Prince Chocolate SP 48g 6x24 CP S&W Auto
B/P Prince Choco Jammies BP 17g 15x24
S/P Tiger Fortified SP 30g 12x30 [CPNBunyad] - LMT
B/P Oreo Strawberry BP 26.4g 12x24 - LMT
B/P Oreo Strawberry BP 26.4g 12x24
S/P Gala Egg SP 51g 6x24 [ND] CP S&W
S/P Gala Egg SP 51g 6x24 [ND] CP S&W - LMT
S/P Prince Chocolate SP 48g 6x24 [Edge]Manual - LMT
B/P Prince Choco Jammies BP 17g 15x24 - LMT
S/P Oreo Strawberry SP 52.8g 6x24 - LMT
S/P Oreo Strawberry SP 52.8g 6x24
S/P Prince Chocolate SP 48g 6x24 CP S&W Auto - LMT
BP Gala EGG BP 20.4g 12x30 ND CP S W
BP Gala EGG BP 20.4g 12x30 ND CP S W LMT
T/P Oreo Crispy TP 13g 24x24 - LMT
F/P Wheatable Sugar Free FP114g 1x48
F/P Wheatable Sugar Free FP114g 1x48 - LMT
S/P Prince Choco SP 48g 6x24 [Bar]Manual S&W
S/P Prince Choco SP 48g 6x24 [Bar]Manual S&W - LMT
S/P Prince Chocolate SP 48g 6x24 CP S&W
S/P Prince Chocolate SP 48g 6x24 CP S&W - LMT
F/P Oreo Original FP 105.6g 1x96
F/P Oreo Original FP 105.6g 1x96 - LMT
B/P Prince Chocolate BP 32g 12x24 (CAMA)
B/P Prince Chocolate BP 32g 12x24 (CAMA) - LMT
B/P Oreo Original BP 26.4g 12x24 - LMT
F/P OREO Crumbs 1000g x 10 - LMT
S/P OREO Crumbs 250g x 24 - LMT
B/P OREO Crumbs 100g x 12 x 6 - LMT
B/P OREO Crumbs 100g x 12 x 6 - LMT
S/P TUC SP 45.6g 6x30 [CP TANG]
B/P TUC BP 22.8g 12x24 [CP TANG]
F/P Oreo Original FP (Tube) 105.6g 1x24
F/P Oreo Original FP (Tube) 105.6g 1x24 - LMT
S/P TUC SP 45.6g 6x30 [CP TANG] - LMT
B/P TUC BP 22.8g 12x24 [CP TANG] - LMT
F/P OREO Crumbs 1000g x 10
S/P OREO Crumbs 250g x 24
B/P OREO Crumbs 100g x 12 x 6
S/P Bakeri Bistiks SP 35g 6x24
S/P Bakeri Bistiks SP 35g 6x24 - LMT
B/P Tiger BP 15g 24x24 [CP Nestle Bunyad]
B/P Tiger BP 15g 24x24 [CP Nestle Bunyad] - LMT
T/P Oreo Crispy TP 13.0g 26x24 [CP 24+2]
T/P Oreo Crispy TP 13.0g 26x24 [CP 24+2] - LMT
B/P Bakeri Bistiks BP 20g 12x24 - LMT
B/P Bakeri Bistiks BP 20g 12x24
F/P Bakeri Bistiks FP 65g 1x96
F/P Bakeri Bistiks FP 65g 1x96 - LMT
B/P Tiger BP 15g 24x24
B/P Mini Oreo Strawberry BP 20g 12x24
B/P Mini Oreo Chocolate BP 20g 12x24
T/P Mini Oreo Chocolate TP 10g 24x24
B/P Tiger BP 15g 24x24 - LMT
B/P Mini Oreo Strawberry BP 20g 12x24 - LMT
B/P Mini Oreo Chocolate BP 20g 12x24 - LMT
T/P Mini Oreo Chocolate TP 10g 24x24 - LMT
S/P Tiger SP 30g 12x24
S/P Tiger SP 30g 12x24 - LMT
B/P Oreo Original BP 26.4g12x24 [CPBaskinRob
B/P Oreo Original BP 26.4g12x24 [CPBaskinRob - LMT
S/P Oreo Original SP52.8g 6x24 [CPBaskinRobn
S/P Oreo Original SP52.8g 6x24 [CPBaskinRobn - LMT
T/P Mini Oreo Original TP 10g 24x24
T/P Mini Oreo Original TP 10g 24x24 - LMT
B/P Mini Oreo Original BP 20g 12x24
B/P Mini Oreo Original BP 20g 12x24 - LMT
T/P Mini Oreo Strawberry TP 10g 24x24
T/P Mini Oreo Strawberry TP 10g 24x24 - LMT
B/P Prince Chocolate BP 28.8g 12x24 (Manual)
S/P Prince Chocolate SP 43.2g 6x24 (Manual)
S/P Prince Chocolate SP 43.2g 6x24 (CAMA)
B/P Prince Chocolate BP 28.8g 12x24 (Manual) - LMT
S/P Prince Chocolate SP 43.2g 6x24 (Manual) - LMT
S/P Prince Chocolate SP 43.2g 6x24 (CAMA) - LMT
S/P Milco LU SP 45g 6x24
S/P Prince Chocolate SP 43.2g 6x24(on pile)
S/P Prince Chocolate SP 43.2g 6x24(on pile) - LMT
S/P Candi Original SP 58g 6x24
T/P TUC TP 11.1g 24x24
T/P Bakeri Nan Khatai TP 12.8g 24x24
S/P Candi Original SP 58g 6x24 - LMT
T/P TUC TP 11.1g 24x24 - LMT
T/P Bakeri Nan Khatai TP 12.8g 24x24 - LMT
T/P Prince Chocolate TP 14.4g 24x24 (Manual)
T/P Prince Chocolate TP 14.4g 24x24 (Manual) - LMT
S/P TUC SP 44.4g 6x30
S/P Bakeri Nankhatai SP 44.8g 6x24
S/P Bakeri Nankhatai SP 44.8g 6x24 - LMT
S/P TUC SP 44.4g 6x30 - LMT
B/P TUC BP 22.2g 12x24
B/P TUC BP 22.2g 12x24- LMT
B/P Bakeri Nankhatai BP 25.6g 12x24
B/P Bakeri Nankhatai BP 25.6g 12x24 - LMT
T/P Prince Chocolate TP 14.4g 24x24 (CAMA) - LMT
T/P Prince Chocolate TP 14.4g 24x24 (CAMA)
T/P Candi Original TP 11.6g 24x30
T/P Candi Original TP 11.6g 24x30 - LMT
F/P Prince Chocolate FP 72g1x96 (10Sandwich)
F/P Prince Chocolate FP 72g1x96 (10Sandwich) - LMT
MHR Candi Original BP 23.2g 12x30
MHR Candi Original BP 23.2g 12x30 - LMT
B/P Prince Chocolate BP 28.8g 12x24 (CAMA)
B/P Prince Chocolate BP 28.8g 12x24 (CAMA) - LMT
S/P Oreo Strawberry SP 51g 6x24
S/P Oreo Strawberry SP 51g 6x24 - LMT
F/P TUC FP 77.7g 1x96
F/P TUC FP 77.7g 1x96 - LMT
F/P Candi Original FP 98.6g 1x96
F/P Candi Original FP 98.6g 1x96 - LMT
F/P Bakeri Nankhatai FP 76.8g 1x96
F/P Bakeri Nankhatai FP 76.8g 1x96 - LMT
S/P Oreo Original SP51g 6x24 [CPBaskinRobin]
B/P Oreo Original BP 25.5g12x24 [CPBaskinRob
S/P Oreo Original SP51g 6x24 [CPBaskinRobin] - LMT
B/P Oreo Original BP 25.5g12x24 [CPBaskinRob - LMT
B/P Oreo Original BP 25.5g 12x24
B/P Oreo Original BP 25.5g 12x24 - LMT
S/P Oreo Original SP 51g 6x24
S/P Oreo Original SP 51g 6x24 - LMT
B/P TUC BP 22.2g 12x24 [CP TANG]
B/P TUC BP 22.2g 12x24 [CP TANG] - LMT
S/P
S/P TUC SP 44.4g 6x30 [CP TANG]
S/P TUC SP 44.4g 6x30 [CP TANG] - LMT
B/P OREO Orignl+Straw BP[CPLunch]25.5g 12x24
B/P OREO Orignl+Straw BP[CPLunch]25.5g 12x24 - LMT
B/P OREO Orignl+Straw BP[CPLunch]25.5g 12x24
B/P OREO Orignl+Straw BP[CPLunch]25.5g 12x24 - LMT
B/P Mini Oreo Original BP 20 12x24CPEraser
B/P Mini Oreo Original BP 20 12x24CPEraser LMT
B/P Mini Oreo Chocolte BP 20g12x24CPEraser
B/P Mini Oreo Chocolate BP 20g12x24CPEraser LMT
S/P Milco LU SP 45g 6x24 LMT
B/P Oreo Strawberry BP 25.5g 12x24
B/P Oreo Strawberry BP 25.5g 12x24 LMT
S/P TUC SP 44.4g 6x30 [NP0721]
S/P TUC SP 44.4g 6x30 [NP0721] LMT
S/P Candi Original SP 58g 6x24 [NP0721]
S/P Candi Original SP 58g 6x24 [NP0721] LMT
S/P Oreo Original SP 51g 6x24 [NP0721]
S/P Oreo Original SP 51g 6x24 [NP0721] LMT
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP0721]
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP0721] LMT
S/P Oreo Strawberry SP 51g 6x24 [NP0721]
S/P Oreo Strawberry SP 51g 6x24 [NP0721] LMT
S/P Gala Egg SP 51g 6x24 [NP0721]
S/P Gala Egg SP 51g 6x24 [NP0721] LMT
S/P Zeera Plus SP 59.4g 6x24 [NP0721]
CANCEL
S/P Zeera Plus SP 59.4g 6x24 [NP0721] LMT
S/P Milco LU SP 45g 6x24 [NP0721]
S/P Milco LU SP 45g 6x24 [NP0721] LMT
S/P Bakeri Butter SP 33g 6x24 woTray [NP0721]
S/P Bakeri Butter SP 33g 6x24 woTray [NP0721] LMT
S/P Bakeri Bistiks SP 35g 6x24 [NP0721]
S/P Bakeri Bistiks SP 35g 6x24 [NP0721] LMT
S/P Prince Chocolate SP43.2g6x24 Mnul[NP0721]
S/P Prince Chocolate SP43.2g6x24 Mnul[NP0721] LMT
S/P Prince Chocolate SP 43.2g6x24CAMA[NP0721]
S/P Prince Chocolate SP 43.2g6x24CAMA[NP0721] LMT
S/P Zeera Plus SP 59.4g 6x24 [CP+1BP]
S/P Zeera Plus SP 59.4g 6x24 [CP+1BP] LMT
S/P Candi Original SP 58g 6x24 [CP+1BP]
S/P Candi Original SP 58g 6x24 [CP+1BP] LMT
S/P Gala Egg SP 51g 6x24 [CP+1BP]
S/P Gala Egg SP 51g 6x24 [CP+1BP] LMT
S/P Oreo Original SP 51.0g 6x24 [CP+1BP]
S/P Oreo Original SP 51.0g 6x24 [CP+1BP] LMT
S/P Bakeri NanKhatai SP44.8g 6x24 [CP+1TP]
S/P Bakeri NanKhatai SP44.8g 6x24 [CP+1TP] LMT
S/P TUC SP 44.0g 6x30 [CP+1TP]
S/P TUC SP 44.0g 6x30 [CP+1TP] LMT
S/P Bakeri Bistiks SP 35.0g 6x24 [CP+1BP]
S/P Bakeri Bistiks SP 35.0g 6x24 [CP+1BP] LMT
S/P Prince Chocolate SP 43.2g6x24 Pile[NP0721]
S/P Prince Chocolate SP 43.2g6x24 Pile[NP0721} LMT
F/P Oreo Original FP 102g 1x96 [NP 0821]
F/P Oreo Original FP 102g 1x96 [NP 0821] LMT
F/P Candi Original FP 92.8g 1x96
F/P Candi Original FP 92.8g 1x96 LMT
F/P Oreo Original FP (Tube Pack) 102g 1x24 [NP0821]
F/P Oreo Original FP (Tube Pack) 102g 1x24 [NP0821] LMT
Bakeri Coconut SP 33g 6x24 [NP0721]
Bakeri Coconut SP 33g 6x24 [NP0721] -LMT
Oreo Original FP (Tube Pack) 102g 1x24
Oreo Original FP (Tube Pack) 102g 1x24-LMT
T/P Wheatable High Fiber TP 21.6g 12x24
T/P Wheatable High Fiber TP 21.6g 12x24 LMT
S/P Zeera Plus SP 59.4g 6x24 [NP0921]
S/P Zeera Plus SP 59.4g 6x24 [NP0921] LMT
S/P Candi Original SP 58g 6x24 [NP0921]
S/P Candi Original SP 58g 6x24 [NP0921] LMT
S/P TUC SP 44.4g 6x30 [NP0921]
S/P TUC SP 44.4g 6x30 [NP0921] LMT
S/P Oreo Original SP 51g 6x24 [NP0921]
S/P Oreo Original SP 51g 6x24 [NP0921] LMT
S/P Oreo Strawberry SP 51g 6x24 [NP0921]
S/P Oreo Strawberry SP 51g 6x24 [NP0921] LMT
S/P Zeera Plus SP 59.4g 6x24 [CP+1BP NP0921]
S/P Zeera Plus SP 59.4g 6x24 [CP+1BP NP0921] LMT
F/P OREO CHOCOLATE 68.52g 4x24 Rs. 30
S/P OREO CHOCOLATE 45.68g 6x24 Rs. 20
B/P OREO CHOCOLATE 22.84g 12x24 Rs.10
B/P OREO CHOCOLATE 22.84g 12x24 Rs.10 LMT
S/P OREO CHOCOLATE 45.68g 6x24 Rs. 20 LMT
F/P OREO CHOCOLATE 68.52g 4x24 Rs. 30 LMT
SP Prince Coco Choc SP 24g 6x24 Rs.20
SP Prince Coco Choc SP 24g 6x24 Rs.20 LMT
S/P Oreo Original SP 51g 6x24 [CP+1BP NP021]
S/P Oreo Original SP 51g 6x24 [CP+1BP NP021] LMT
S/P Candi Original SP 58g 6x24 [CP+1BPNP0921
S/P Candi Original SP 58g 6x24 [CP+1BPNP0921 LMT
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP1021]
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP1021] LMT
S/P TUC SP 44.4g 6x30 [CP+1TP NP0921]
S/P TUC SP 44.4g 6x30 [CP+1TP NP0921] LMT
S/P Bakeri Bistiks SP 35g 6x24 [NP1021]
S/P Bakeri Bistiks SP 35g 6x24 [NP1021] LMT
S/P Gala Egg SP 51g 6x24 [NP1021]
S/P Gala Egg SP 51g 6x24 [NP1021] LMT
T/P Tiger TP 14g 24x24
T/P Tiger TP 14g 24x24 LMT
S/P Bakeri Coconut SP 33g 6x24 [NP1021]
S/P Bakeri Coconut SP 33g 6x24 [NP1021] LMT
T/P Oreo Crispy TP 13g 30x24
T/P Oreo Crispy TP 13g 30x24 LMT
F/P Zeera Plus FP 118.8g 1x96
F/P Zeera Plus FP 118.8g 1x96 LMT
F/P Gala Egg FP 112.2g 1x96 [NP1021]
F/P Gala Egg FP 112.2g 1x96 [NP1021] LMT
F/P TUC FP 88.8g 1x96
F/P TUC FP 88.8g 1x96 LMT
S/P Prince Mini Fingers SP 30.7g 6x24 Rs.20
S/P Prince Mini Fingers SP 30.7g 6x24 Rs.20 LMT
B/P Prince Mini Fingers BP 15.3g 12x24 Rs10
B/P Prince Mini Fingers BP 15.3g 12x24 Rs10 LMT
B/P Prince Choco Jammies BP 14.5G 15x24
B/P Prince Choco Jammies BP 14.5G 15x24 LMT
B/P Prince Choco Jammies BP 22.0g 10x24 Rs.15
B/P Prince Choco Jammies BP 22.0g 10x24 Rs.15 LMT
B/P Prince Enrobed 13.5g TP 12x24
B/P Prince Enrobed 13.5g TP 12x24 LMT
B/P Prince Enrobed TP 20.0g 10x24 Rs.15
B/P Prince Enrobed TP 20.0g 10x24 Rs.15 LMT
S/P Bakeri NanKhatai SP44.8g 6x24CP+TPNP1021
S/P Bakeri NanKhatai SP44.8g 6x24CP+TPNP1021 LMT
cancel12
cancel13
F/P Tiger FP 112g 1x96
F/P Tiger FP 112g 1x96 LMT
F/P Candi Original FP 104.4g 1x96
F/P Candi Original FP 104.4g 1x96 LMT
S/P Tiger SP 56g 6x24
S/P Tiger SP 56g 6x24 LMT
S/P Gala Egg SP 51g 6x24 [CP+1BPNP1021]
S/P Gala Egg SP 51g 6x24 [CP+1BPNP1021] LMT
B/P Tiger BP 28g 12x24
B/P Tiger BP 28g 12x24 LMT
S/P TUC SP Dipitt Sauces CP 44.4g 6x30
S/P TUC SP Dipitt Sauces CP 44.4g 6x30 LMT
S/P Bakeri Butter SP 33g 6x24 [NP1021]
S/P Bakeri Butter SP 33g 6x24 [NP1021] LMT
B/P Bakeri Butter BP 16.5g 12x24 [NP1021Rs15
B/P Bakeri Butter BP 16.5g 12x24 [NP1021Rs15 LMT
B/P Bakeri Coconut BP 16.5g 12x24 Rs15
B/P Bakeri Coconut BP 16.5g 12x24 Rs15 LMT
S/P TUC SP 44.4g 6x30 [CP Dipitt Sauces]
S/P TUC SP 44.4g 6x30 [CP Dipitt Sauces] LMT
T/P Mini Oreo Original TP 10g 24x24 [CP+2TP]
T/P Mini Oreo Original TP 10g 24x24 [CP+2TP] LMT
T/P Tiger TP 14g 24x24 [Nestle Bunyad]
T/P Tiger TP 14g 24x24 [Nestle Bunyad] LMT
T/P Mini Oreo Chocolate TP 10g 24x24 [CP+2TP]
T/P Mini Oreo Chocolate TP 10g 24x24 [CP+2TP] LMT
S/P TUC SP 44.4g 6x30 [NP1021]
S/P TUC SP 44.4g 6x30 [NP1021] LMT
S/P Zeera Plus SP 59.4g 6x24 [NP1021]
S/P Zeera Plus SP 59.4g 6x24 [NP1021] LMT
S/P Candi Original SP 58g 6x24 [NP1021]
S/P Candi Original SP 58g 6x24 [NP1021] LMT
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP1021]
S/P Bakeri Nankhatai SP 44.8g 6x24 [NP1021] LMT
S/P Bakeri Bistiks SP 35g 6x24 [NP1121]
S/P Bakeri Bistiks SP 35g 6x24 [NP1121] LMT
B/P TUC BP 22.2g 12x24 [CP+ Oreo Chocolat BP]
B/P TUC BP 22.2g 12x24 [CP+ Oreo Chocolat BP] LMT
F/P Bakeri Bistiks FP 65g 1x96 [NP1121]
F/P Bakeri Bistiks FP 65g 1x96 [NP1121] LMT
S/P Zeera Plus SP 59.4g 6x24 [CP - Mezban]
S/P Zeera Plus SP 59.4g 6x24 [CP - Mezban] LMT
S/P Zeera Plus SP 59.4g 6x24 [CP- Danedar]
S/P Zeera Plus SP 59.4g 6x24 [CP- Danedar] LMT
F/P Bakeri Butter FP 66g 1x96 [NP1121]
F/P Bakeri Butter FP 66g 1x96 [NP1121] LMT
F/P Bakeri Nankhatai FP 76.8g 1x96 [NP1121]
F/P Bakeri Nankhatai FP 76.8g 1x96 [NP1121] LMT
T/P Belvita Bran TP 62g 12x6
T/P Belvita Kleija TP 62g 12x6
S/P Prince Mini Fingers SP 26.88g 6x24 Rs.20
S/P Prince Mini Fingers SP 26.88g 6x24 Rs.20 LMT
B/P Prince Mini Fingers BP 13.44g 12x24 Rs10
B/P Prince Mini Fingers BP 13.44g 12x24 Rs10 LMT
T/P Prince Chocolate Bigger TP 10.0g 24x24
B/P Prince Chocolate Bigger BP 20.0g 12x24
S/P Prince Chocolate Bigger SP 50.0g 6x24
F/P Prince Chocolate Bigger FP 100g 1x96
T/P Prince Chocolate Bigger TP 10.0g 24x24 LMT
B/P Prince Chocolate Bigger BP 20.0g 12x24 LMT
S/P Prince Chocolate Bigger SP 50.0g 6x24 LMT
F/P Prince Chocolate Bigger FP 100g 1x96 LMT
B/P Bakeri Nankhatai BP 19.2g 12x24
B/P Bakeri Nankhatai BP 19.2g 12x24 LMT
T/P Mini Oreo Original TP 10g 48x12 CP P.Box
T/P Mini Oreo Original TP 10g 48x12 CP P.Box LMT
S/P Candi Original SP 58g 6x24 [CP Nescafe] LMT
S/P Candi Original SP 58g 6x24 [CP Nescafe]
S/P Gala Egg SP 56.1g 6x24
S/P Gala Egg SP 56.1g 6x24 LMT
T/P Tiger TP 13.2g 24x24 Rs.5
T/P Tiger TP 13.2g 24x24 Rs.5 LMT
T/P Tiger TP 13.2g 26x24 [CP+2TP]
T/P Tiger TP 13.2g 26x24 [CP+2TP] LMT
T/P TUC TP 7.4g 24x24
T/P TUC TP 7.4g 24x24 LMT
B/P Prince Chocolate BP 20g 13x24 [CP+1BP]
B/P Prince Chocolate BP 20g 13x24 [CP+1BP] LMT
T/P Prince Chocolate TP 10g 26x24 [CP+2TP]
T/P Prince Chocolate TP 10g 26x24 [CP+2TP] LMT
B/P TUC BP 14.8g 12x24
B/P TUC BP 14.8g 12x24 LMT
HR Gala Egg HR 40.8g 6x24 (4+4 on pile)
HR Gala Egg HR 40.8g 6x24 (4+4 on pile) LMT
T/P Wheatable Sugar Free TP 28.5g 12x24 Rs.20
T/P Wheatable Sugar Free TP28.5g 12x24 Rs.20 LMT
F/P Bakeri Coconut FP 66g 1x96 [NP1121]
F/P Bakeri Coconut FP 66g 1x96 [NP1121] LMT
S/P Peanut Maza SP 51.7g 6x24
S/P Wheatable High Fiber SP 64.8g6x24[NP1221
S/P Wheatable High Fiber SP 64.8g6x24[NP1221] LMT
S/P Bakeri Classic 52.2g SP 6x24 Rs.20
B/P Bakeri Classic 4.67g BP 12x24 Rs.10
T/P Tiger TP 13.2g 24x24 Rs.5 Babar Azam
T/P Tiger TP 13.2g 24x24 Rs.5 Babar Azam LMT
S/P Oreo Original SP 39.2g 6x24
S/P Oreo Original SP 39.2g 6x24 LMT
T/P Tiger TP 13.2g 24x24 (Nestle Bunyad CP)
T/P Tiger TP 13.2g 24x24 (Nestle Bunyad CP) LMT
B/P Oreo Original BP 19.6g 12x24
B/P Oreo Original BP 19.6g 12x24 LMT
S/P Mini Oreo Original SP 35g 6x24
S/P Mini Oreo Original SP 35g 6x24 LMT
S/P Mini Oreo Chocolate SP 35g 6x24
S/P Mini Oreo Chocolate SP 35g 6x24 LMT
S/P Gala Egg SP 56.1g 6x24 [CP+1BP 20.4g]
S/P Gala Egg SP 56.1g 6x24 [CP+1BP 20.4g] LMT
S/P Candi Original SP 58g 6x24 [CP+1 BP23.2g
S/P Candi Original SP 58g 6x24 [CP+1 BP23.2g LMT
B/P Mini Oreo Original BP Rs.10 17.5g 12X24
B/P Mini Oreo Original BP Rs.10 17.5g 12X24 LMT
B/P Mini Oreo Chocolate BP Rs.10 17.5g 12X24
B/P Mini Oreo Chocolate BP Rs.10 17.5g 12X24 LMT
S/P Tiger SP 52.8g 6x24 Rs. 20
S/P Tiger SP 52.8g 6x24 Rs. 20 LMT
B/P Tiger BP 26.4g 12x24 Rs. 10
B/P Tiger BP 26.4g 12x24 Rs.10 LMT
F/P Oreo Original FP 78.4G 1x96
F/P Oreo Original FP 78.4G 1x96 LMT
S/P Wheatable SF SP 57g 6x24 Rs40 [NP1221]
S/P Wheatable SF SP 57g 6x24 Rs40 [NP1221] LMT
F/P Wheatable Sugar Free FP114g 1x48[NP0222]
F/P Wheatable Sugar Free FP114g 1x48[NP0222] LMT
S/P Zeera Plus SP 59.4g 6x24 [CP - Vital NP]
S/P Zeera Plus SP 59.4g 6x24 [CP - Vital NP] LMT
B/P Bakeri Bistiks BP 15g 12x24
B/P Bakeri Bistiks BP 15g 12x24 LMT
S/P TUC SP 44.4g 6x30 [CP TANG]
S/P TUC SP 44.4g 6x30 [CP TANG] LMT
F/P Oreo Original VP 58.8g 5x24 Rs 30
F/P Oreo Original VP 58.8g 5x24 Rs 30 LMT
B/P Tiger BP 26.4g 13x24 Rs. 10 [CP+1]
B/P Tiger BP 26.4g 13x24 Rs. 10 [CP+1] LMT
B/P TUC BP 14.8g 12x24 [CP TANG]
B/P TUC BP 14.8g 12x24 [CP TANG] LMT
S/P Wheatable HF SP 64.8g 6x24[CPTapalGreenT
S/P Bakeri Nankhatai SP 44.8g 6x24 [CP +1BP19.2g]
S/P Bakeri Nankhatai SP 44.8g 6x24 [CP +1BP19.2g] - LMT
S/P Wheatable HF SP 64.8g 6x24[CPTapalGreenT - LMT
S/P Wheatable SF SP 57g 6x24 [CP TGreen Tea]
S/P Wheatable SF SP 57g 6x24 [CP TGreen Tea] - LMT
B/P Bakeri Nankhatai BP 19.2g 12x24 [CP +1BP]
B/P Bakeri Nankhatai BP 19.2g 12x24 [CP +1BP] - LMT
S/P Zeera Plus SP 59.4g 6x24Rs25 [CP+1BP21.6
S/P Zeera Plus SP 59.4g 6x24Rs25 [CP+1BP21.6 - LMT
S/P Prince Coco Choc SP 24g 6x24 [CP Offer]
S/P Prince Coco Choc SP 24g 6x24 [CP Offer] - LMT
MHR Zeera Plus BP 21.6g 12x30 [CP Vital]
MHR Zeera Plus BP 21.6g 12x30 [CP Vital] - LMT
S/P OREO CHOCOLATE SP 39.2g 6x24 Rs. 20
B/P OREO CHOCOLATE BP 19.6g 12x24 Rs.10
S/P OREO CHOCOLATE SP 39.2g 6x24 Rs. 20 - LMT
B/P OREO CHOCOLATE BP 19.6g 12x24 Rs.10 - LMT
S/P Bakeri Nankhatai SP44.8g6x24[CP+TPNP1021
S/P Bakeri Nankhatai SP44.8g6x24[CP+TPNP1021 - LMT
S/P Zeera Plus SP 59.4g 6x24 [CP-Islamabad Tea]
S/P Zeera Plus SP 59.4g 6x24 [CP-Islamabad Tea] - LMT
S/P Prince Chocolate SP 50.0g 6x24 [CP+1BP]
S/P Prince Chocolate SP 50.0g 6x24 [CP+1BP] - LMT
T/P Bakeri Nan Khatai TP 12.8g 24x24 [NP0422
T/P Bakeri Nan Khatai TP 12.8g 24x24 [NP0422 - LMT
T/P Prince Junior 12g 26x24 [CP 24+2]
T/P Prince Junior 12g 26x24 [CP 24+2] - LMT
F/P OREO CHOCOLATE FP 58.8g 5x24 Rs.30
F/P OREO CHOCOLATE FP 58.8g 5x24 Rs.30 - LMT
unknow
T/P Bakeri NanKhatai 12.8g26x24[24+2TP CP]
T/P Bakeri NanKhatai 12.8g26x24[24+2TP CP] - LMT
S/P Gala Egg 61.2g 6x24
S/P Candi Original 69.6G 6x24
F/P Gala Egg 112.2g 1x96 Rs. 60
F/P Candi Original 127.6g 1x96 Rs.60
S/P Gala Egg 61.2g 6x24 LMT
S/P Candi Original 69.6G 6x24 LMT
F/P Gala Egg 112.2g 1x96 Rs. 60 LMT
F/P Candi Original 127.6g 1x96 Rs.60 LMT
F/P Wheatable HighFiber 129.6g 1x48 [NP0420]
Wheatable Sugar Free FP114g 1x48[NP0222]
H/R Candi Original 40.6g 10x24
H/R Wheatable Cardamom 32.4g 10x24
Mini Oreo Original TP 10g x 30 x 24
Mini Oreo Chocolate TP 10g x 30 x 24
F/P Wheatable HighFiber 129.6g 1x48 [NP0420] LMT
Wheatable Sugar Free FP114g 1x48[NP0222] LMT
H/R Candi Original 40.6g 10x24 LMT
H/R Wheatable Cardamom 32.4g 10x24 LMT
Mini Oreo Original TP 10g x 30 x 24 LMT
Mini Oreo Chocolate TP 10g x 30 x 24 LMT
BP Zeera Plus 21.6g 12x30 [CP Vital]
T/P Zeera Plus 10.8g 24x30 [CP Vital]
BP Zeera Plus 21.6g 12x30 [CP Vital] LMT
Zeera Plus TP 10.8g 24x30 [CP Vital] LMT
F/P Prince Chocolate Bigger 95g 1x96
F/P TUC 88.8g 1x96
F/P Zeera Plus 118.8g 1x96
Prince Chocolate Bigger SP 57g 6x24
S/P TUC 44.4g 6x30 [NP0622]
S/P Zeera Plus 64.8g 6x24 [NP0722]
S/P Bakeri Butter 33g 6x24 [NP0622]
S/P Bakeri Bistiks 45g 6x24 [NP0622]
S/P Bakeri Nankhatai 44.8g 6x24 [NP 0622]
B/P Prince Chocolate Bigger 19g 12x24
B/P Bakeri Butter 11.g 20x24
T/P Prince Chocolate Bigger 9.5g 24x24
T/P Oreo Crispy 12g 30x24
T/P TUC 7.4g 24x24
F/P Bakeri Butter 66g 1x96 [NP0622]
F/P Bakeri Coconut 66g 1x96 [NP0622]
F/P Bakeri Bistiks 65g 1x96 [NP0622]
F/P Bakeri Nankhatai 76.8g 1x96 [NP0622]
S/P Bakeri Coconut 33g 6x24 [NP0622]
S/P Bakeri Classic 37.36g 6x24
H/R Bakeri Nan Khatai 32g 9x24 [NP0622]
H/R Bakeri Bistiks 30g 8x24
H/R TUC 29.6g 10x24
H/R Bakeri Butter 22g 8x24
H/R Bakeri Coconut 22g 8x24
H/R Prince Chocolate Bigger 38g 10x24
H/R Zeera Plus 43.2g 10x24
Candi Crush
T/P Zeera Plus 10.8g 24x30
T/P Junior Prince 12g 24x24
T/P Oreo Crispy 12g 24x24
T/P Candi Original 11.6g 24x30
T/P Gala EGG 10.2g 24x30 [ND]
H/R Wheatable High Fiber 43.2g 8x24
F/P Prince Chocolate Bigger 95g 1x96 LMT
F/P TUC 88.8g 1x96 LMT
F/P Zeera Plus 118.8g 1x96 LMT
Prince Chocolate Bigger SP 57g 6x24 LMT
S/P TUC 44.4g 6x30 [NP0622] LMT
S/P Zeera Plus 64.8g 6x24 [NP0722] LMT
S/P Bakeri Butter 33g 6x24 [NP0622] LMT
S/P Bakeri Bistiks 45g 6x24 [NP0622] LMT
S/P Bakeri Nankhatai 44.8g 6x24 [NP 0622] LMT
B/P Prince Chocolate Bigger 19g 12x24 LMT
B/P Bakeri Butter 11.g 20x24 LMT
T/P Prince Chocolate Bigger 9.5g 24x24 LMT
T/P Oreo Crispy 12g 30x24 LMT
T/P TUC 7.4g 24x24 LMT
F/P Bakeri Butter 66g 1x96 [NP0622] LMT
F/P Bakeri Coconut 66g 1x96 [NP0622] LMT
F/P Bakeri Bistiks 65g 1x96 [NP0622] LMT
F/P Bakeri Nankhatai 76.8g 1x96 [NP0622] LMT
S/P Bakeri Coconut 33g 6x24 [NP0622] LMT
H/R Bakeri Nan Khatai 32g 9x24 [NP0622] LMT
H/R Bakeri Bistiks 30g 8x24 LMT
H/R TUC 29.6g 10x24 LMT
H/R Bakeri Butter 22g 8x24 LMT
H/R Bakeri Coconut 22g 8x24 LMT
H/R Prince Chocolate Bigger 38g 10x24 LMT
H/R Zeera Plus 43.2g 10x24 LMT
T/P Zeera Plus 10.8g 24x30 LMT
T/P Junior Prince 12g 24x24 LMT
T/P Oreo Crispy 12g 24x24 LMT
T/P Candi Original 11.6g 24x30 LMT
T/P Gala EGG 10.2g 24x30 [ND] LMT
H/R Wheatable High Fiber 43.2g 8x24 LMT
F/P Oreo Original 76.0g 1x96
F/P Oreo Original 76G 1x24
V/P Oreo Original 57.0g 5x24 Rs 30
S/P Oreo Original 38.0g 10x24
B/P Tiger 24.0g 12x24
B/P Oreo Original 19.0g 12x24
T/P Tiger 12.0g 24x24 Rs.5
F/P Oreo Original 76.0g 1x96 LMT
F/P Oreo Original 76G 1x24 LMT
V/P Oreo Original 57.0g 5x24 Rs 30 LMT
S/P Oreo Original 38.0g 10x24 LMT
B/P Tiger 24.0g 12x24 LMT
B/P Oreo Original 19.0g 12x24 LMT
T/P Tiger 12.0g 24x24 Rs.5 LMT
B/P Candi Original 17.4g 12x24
B/P Candi Original 17.4g 12x24 - LMT
T/P Oreo Crispy G12 30x24
T/P Oreo Crispy G12 30x24 LMT
B/P Zeera Plus 16.2g 12x24
B/P Zeera Plus 16.2g 12x24 LMT
B/P Milco LU Waffle 20g 16x24
B/P OREO CHOCOLATE 19.0g 12x24 Rs.10
S/P OREO CHOCOLATE 38.0g 10x24 Rs. 20
V/P OREO CHOCOLATE 57g 5x24 Rs.30
B/P Milco LU Waffle 20g 16x24 LMT
B/P OREO CHOCOLATE 19.0g 12x24 Rs.10 LMT
S/P OREO CHOCOLATE 38.0g 10x24 Rs. 20 LMT
V/P OREO CHOCOLATE 57g 5x24 Rs.30 LMT
B/P Oreo Original19.0g 12x24 (CP back to School)
B/P Oreo Original19.0g 12x24 (CP back to School) - LMT
S/P Oreo Original 38.0g AZ10x24 - LMT
B/P Oreo Original 19.0g AZ 12x24 - LMT
S/P Oreo Original 38.0g AZ10x24
B/P Oreo Original 19.0g AZ 12x24
S/P Oreo Original 38.0g OD 10x24-LMT
S/P Oreo Original 38.0g OD 10x24
H/R Wheatable Cardamom 32.4g 8x24
H/R Wheatable Cardamom 32.4g 8x24 LMT
S/P Zeera Plus 59.4g x 6x24 Rs.30
S/P Zeera Plus 59.4g x 6x24 Rs.30 - LMT
B/P Bakeri Classic 28.02g 12x24 Rs.10 - LMT
S/P Bakeri Classic 52.2g 6x24 Rs.20 - LMT
S/P TUC 40.7g 6x30
S/P TUC 40.7g 6x30 - LMT
F/P Wheatable HighFiber 129.6g 1x48
F/P Wheatable Sugar Free 114g 1x48 NP0822
S/P Wheatable High Fiber 64.8g 6x24
S/P Wheatable SF 57g 6x24 Rs45 [NP0822]
H/R Wheatable High Fiber 43.2g 8X24
T/P Wheatable High Fiber 21.6g 12x24
T/P Wheatable Sugar Free 28.5g 12x24 Rs.25
S/P Candi 63.8g 6x24 Rs.30
S/P Gala Egg 56.1g 6x24 Rs. 30
F/P Wheatable HighFiber 129.6g 1x48 LMT
F/P Wheatable Sugar Free 114g 1x48 NP0822 LMT
S/P Wheatable High Fiber 64.8g 6x24 LMT
S/P Wheatable SF 57g 6x24 Rs45 [NP0822] LMT
H/R Wheatable High Fiber 43.2g 8X24 LMT
T/P Wheatable High Fiber 21.6g 12x24 LMT
T/P Wheatable Sugar Free 28.5g 12x24 Rs.25 LMT
S/P Candi 63.8g 6x24 Rs.30 LMT
S/P Gala Egg 56.1g 6x24 Rs. 30 LMT
HR Gala Egg 40.8g 10X24 (4+4 on pile)
HR Gala Egg 40.8g 10X24 (4+4 on pile) - LMT
B/P Oreo Original Ind Day 19.0g 20x24
B/P Oreo Original Ind Day 19.0g 20x24 - LMT
TP Tiger 12.0g 24x24 Rs.5
TP Tiger 12.0g 24x24 Rs.5 LMT
TP Prince Chocolate Bigger 9.5g 24x24 LMT
TP Prince Chocolate Bigger 9.5g 24x24
FP Prince Chocolate Bigger 95g 1x96 Rs.80
FP Oreo Original 76.0g 1x96 Rs.80
Oreo Original FP Tube 76g 1x24 Rs. 50
FP TUC 88.8g 1x96 Rs. 80
FP Candi Original 127.6g 1x96 Rs.80
FP Gala Egg 112.2g 1x96 Rs. 80
FP Zeera Plus 118.8g 1x96 Rs. 80
FP Bakeri Butter 66g 1x96 Rs. 80
FP Bakeri Coconut 66g 1x96 Rs. 80
FP Bakeri Bistiks 65g 1x96 Rs. 80
FP Bakeri Nankhatai 76.8g 1x96 Rs. 80
FP Prince Chocolate Bigger 95g 1x96 Rs.80 LMT
FP Oreo Original 76.0g 1x96 Rs.80 LMT
Oreo Original FP Tube 76g 1x24 Rs. 50 LMT
FP TUC 88.8g 1x96 Rs. 80 LMT
FP Candi Original 127.6g 1x96 Rs.80 LMT
FP Gala Egg 112.2g 1x96 Rs. 80 LMT
FP Zeera Plus 118.8g 1x96 Rs. 80 LMT
FP Bakeri Butter 66g 1x96 Rs. 80 LMT
FP Bakeri Coconut 66g 1x96 Rs. 80 LMT
FP Bakeri Bistiks 65g 1x96 Rs. 80 LMT
FP Bakeri Nankhatai 76.8g 1x96 Rs. 80 LMT
BP Tiger 24.0g 12x24 (Only For GK)
SP Prince Chocolate 57g 6x24 [CAMA]
SP Prince Chocolate 57g 6x24 [CAMA] - LMT
HR Prince Chocolate 38g 12x24 [CAMA]
HR Prince Chocolate 38g 12x24 [CAMA] - LMT
FP Wheatable HighFiber 129.6g 1x48 Rs.90
VP Oreo Chocolate 57.0g 5x24 Rs.40
VP Oreo Original 57.0g 5x24 Rs 40
SP Prince Chocolate 57.0g 6x24 Rs.40
SP Prince Chocolate 57g 6x24 CAMA Rs.40
SP Oreo Original 38.0g 10x24 Rs. 30
SP OREO CHOCOLATE SP 38.0g 10x24 Rs.30
SP Mini Oreo Original 25g 6x24 Rs.20
SP Mini Oreo Chocolate 25g 6x24 Rs.20
SP Candi Original 63.8g 6x24 Rs 40
SP Zeera Plus 64.8g 6x24 Rs.40
SP Wheatable High Fiber 64.8g6x24 Rs.40
HR Prince Chocolate 38.0g 10x24 Rs.30
HR Prince Chocolate 38g 12x24[CAMA]Rs.30
HR Candi Original 46.4g 10x24 Rs. 30
HR Zeera Plus 43.2g 10x24 Rs.30
HR Wheatable High Fiber 43.2g 8X24 Rs.30
BP Prince Chocolate 19.0g 12x24 Rs.15
BP Oreo Original 19.0g 12x24 Rs.15
BP OREO CHOCOLATE 19.0g 12x24 Rs.15
BP Mini Oreo Original 12.5g 12X24 Rs.10
BP Mini Oreo Chocolate 12.5g 12X24 Rs.10
TP Oreo Crispy 13g 30x24 Rs.10
TP Mini Oreo Original 7.5g 30x24 Rs. 5
TP Mini Oreo Chocolate 7.5g 30x24 Rs. 5
FP Wheatable HighFiber 129.6g 1x48 Rs.90 LMT
VP Oreo Chocolate 57.0g 5x24 Rs.40 LMT
VP Oreo Original 57.0g 5x24 Rs 40 LMT
SP Prince Chocolate 57.0g 6x24 Rs.40 LMT
SP Prince Chocolate 57g 6x24[CAMA] Rs.40 LMT
SP Oreo Original 38.0g 10x24 Rs. 30 LMT
SP OREO CHOCOLATE SP 38.0g 10x24 Rs.30 LMT
SP Mini Oreo Original 25g 6x24 Rs.20 LMT
SP Mini Oreo Chocolate 25g 6x24 Rs.20 LMT
SP Candi Original 63.8g 6x24 Rs 40 LMT
SP Zeera Plus 64.8g 6x24 Rs.40 LMT
SP Wheatable High Fiber 64.8g6x24 Rs.40 LMT
HR Prince Chocolate 38.0g 10x24 Rs.30 LMT
HR Prince Chocolate 38g 12x24[CAMA]Rs.30 LMT
HR Candi Original 46.4g 10x24 Rs. 30 LMT
HR Zeera Plus 43.2g 10x24 Rs.30 LMT
HR Wheatable High Fiber 43.2g 8X24 Rs.30 LMT
BP Prince Chocolate 19.0g 12x24 Rs.15 LMT
BP Oreo Original 19.0g 12x24 Rs.15 LMT
BP OREO CHOCOLATE 19.0g 12x24 Rs.15 LMT
BP Mini Oreo Original 12.5g 12X24 Rs.10 LMT
BP Mini Oreo Chocolate 12.5g 12X24 Rs.10 LMT
TP Oreo Crispy 13g 30x24 Rs.10 LMT
TP Mini Oreo Original 7.5g 30x24 Rs. 5 LMT
TP Mini Oreo Chocolate 7.5g 30x24 Rs. 5 LMT
SP Bakeri Butter 33g 6x24 Rs 40
SP Bakeri Coconut 33g 6x24 Rs 40
SP Bakeri Bistiks 45g 6x24 Rs 40
HR Bakeri Bistiks 30.0g 8x24 Rs 30
BP Bakeri Coconut 16.5g 12x24 Rs 20
BP Bakeri Butter 16.5g 12x24 Rs20
BP Bakeri Bistiks 15g 12x24 Rs 15
SP Bakeri Butter 33g 6x24 Rs 40 LMT
SP Bakeri Coconut 33g 6x24 Rs 40 LMT
SP Bakeri Bistiks 45g 6x24 Rs 40 LMT
HR Bakeri Bistiks 30.0g 8x24 Rs 30 LMT
BP Bakeri Coconut 16.5g 12x24 Rs 20 LMT
BP Bakeri Butter 16.5g 12x24 Rs20 LMT
BP Bakeri Bistiks 15g 12x24 Rs 15 LMT
BP Milco Lu Waffle 20.0g 16x24 Rs.15
BP Milco Lu Waffle 20.0g 16x24 Rs.15 - LMT
TP Oreo Crispy 13g 24x24 Rs.10
TP Oreo Crispy 13g 24x24 Rs.10 - LMT
SP MilcoLu 45g 6x24 Rs.30
BP MilcoLu 22.5g 12x24 Rs.15
SP MilcoLu 45g 6x24 Rs.30 - LMT
BP MilcoLu 22.5g 12x24 Rs.15 - LMT
BP Candi Original 23.2g 16x18 Rs.15
BP Candi Original 23.2g 16x18 Rs.15 - LMT
BP Candi Original 23.2g 16x18 Rs.15
BP Candi Original 23.2g 16x18 Rs.15 - LMT
SP Candi Original 63.8g6x24[CPNescafe31
SP Zeera Plus 64.8g 6x24[CPTapal] Rs.40
SP Milco LU 45g 6x24 CP [6SP+1BP] Rs.30
SP Candi Original 63.8g6x24[CPNescafe31 LMT
SP Zeera Plus 64.8g 6x24[CPTapal] Rs.40 LMT
SP Milco LU 45g 6x24 CP [6SP+1BP] Rs.30 LMT
BP Zeera Plus 21.6g 12x24 Rs 15
BP Zeera Plus 21.6g 12x24 Rs 15 - LMT
SP TUC 40.7g 6x18 Rs. 30
SP TUC 40.7g 6x18 Rs. 30 - LMT
SP TUC 44.4g 6x18 Rs. 40 LMT
HP TUC 33.3g 8 x 18 Rs.30 LMT
BP TUC 14.8g 16x18 Rs.15 LMT
SP TUC 44.4g 6x18 Rs. 40
HR TUC 33.3g 8 x 18 Rs.30
BP TUC 14.8g 16x18 Rs.15
FP Bakeri Nan Khatai 89.6g 1x96 Rs.80
FP Wheatable Sugar Free 85.5g 1x48 Rs90
SP Candi Original 63.8G 6x18 Rs 40
SP Bakeri Nankhatai 51.2g 6x18 Rs. 40
SP Wheatable Suagr Free 38g 6x18 Rs40
HR Candi Original 46.4g 8x18 Rs. 30
HR Bakeri Nankhatai 38.4g 8x18 Rs. 30
BP Prince Choco Jammies 22g 12x18 Rs.20
BP Bakeri Nankhatai 19.2g 16x18 Rs.15
BP Prince Enrobe 20g 12x18 Rs. 20
TP Wheatable Sugar Free 19g 12x18 Rs.20
TP Wheatable Enrobe 15g 10x24 Rs15
FP Bakeri Nan Khatai 89.6g 1x96 Rs.80 LMT
FP Wheatable Sugar Free 85.5g 1x48 Rs90 LMT
SP Candi Original 63.8G 6x18 Rs 40 LMT
SP Bakeri Nankhatai 51.2g 6x18 Rs. 40 LMT
SP Wheatable Suagr Free 38g 6x18 Rs40 LMT
HR Candi Original 46.4g 8x18 Rs. 30 LMT
HR Bakeri Nankhatai 38.4g 8x18 Rs. 30 LMT
BP Prince Choco Jammies 22g 12x18 Rs.20 LMT
BP Bakeri Nankhatai 19.2g 16x18 Rs.15 LMT
BP Prince Enrobe 20g 12x18 Rs. 20 LMT
TP Wheatable Sugar Free 19g 12x18 Rs.20 LMT
TP Wheatable Enrobe 15g 10x24 Rs15 LMT
SP Milco LU 45g 6x24 CP [6SP+1BP] Rs.30
SP Milco LU 45g 6x24 CP [6SP+1BP] Rs.30 LMT
FP Candi Original 139.2g 1x96 Rs.80
FP Candi Original 139.2g 1x96 Rs.80 LMT
FP Gala Egg 122.4g 1x96 Rs. 80
FP Zeera Plus 129.6g 1x96 Rs. 80
SP Prince Mini Fingers 21.12g 6x24 Rs.20
BP Prince Mini Fingers 9.6g 12x24 Rs10
FP Gala Egg 122.4g 1x96 Rs.80 LMT
FP Zeera Plus 129.6g 1x96 Rs. 80 LMT
SP Prince Mini Fingers 21.12g 6x24 Rs.20 LMT
BP Prince Mini Fingers 9.6g 12x24 Rs10 LMT
SP Mini Oreo Original 30g 6x24 Rs.20
SP Mini Oreo Chocolate 30g 6x24 Rs.20
BP Mini Oreo Original 15g 12X24 Rs.10
BP Mini Oreo Chocolate 15g 12X24 Rs.10
SP Mini Oreo Original 30g 6x24 Rs.20 LMT
SP Mini Oreo Chocolate 30g 6x24 Rs.20 LMT
BP Mini Oreo Original 15g 12X24 Rs.10 LMT
BP Mini Oreo Chocolate 15g 12X24 Rs.10 LMT
BP Zeera Plus 21.6g 12x30 Rs 15
BP Zeera Plus 21.6g 12x30 Rs 15 LMT
BP Bakeri Classic 18.68g 12x24
SP Bakeri Classic 37.36g 6x24
BP Bakeri Classic 18.68g 12x24 LMT
SP Bakeri Classic 37.36g 6x24 LMT
TP Wheatable Enrobe 15g 16x18 Rs15
TP Wheatable Enrobe 15g 16x18 Rs15 LMT
SP Bakeri Bistiks 45g 6x18 Rs 40
HR Bakeri Classic 37.36g 8x18 Rs.20
BP Bakeri Classic 18.68g 16x18 Rs.10
SP Bakeri Bistiks 45g 6x18 Rs 40 LMT
HR Bakeri Classic 37.36g 8x18 Rs.20 LMT
BP Bakeri Classic 18.68g 16x18 Rs.10 LMT
BP Prince Mini Star 18.0g 12x18 Rs.20
BP Prince Mini Star 18.0g 12x18 Rs.20 LMT
SP Milco LU 45g 6x24 Rs.25
SP Milco LU 45g 6x24 Rs.25 LMT
TP Belvita Bran 62g 12x6
TP Belvita Kleija 62g 12x6
TP Belvita Bran 62g 12x6 LMT
TP Belvita Kleija 62g 12x6 LMT
BP Prince Mini Chocolate 12g 16x24 Rs10
BP Prince Mini Chocolate 12g 16x24 Rs10 LMT
SP TUC 44.4g 6x30 [CP Rs. 15 off]
SP Bakeri Nankhatai 51.2g 6x18 [CP Rs15 off
BP TUC 14.8g 16x18 [CP Rs. 15 off]
BP Bakeri NK 19.2g 16x18 [CP Rs. 15 off]
SP TUC 44.4g 6x30 [CP Rs. 15 off] LMT
SP Bakeri Nankhatai 51.2g 6x18 [CP Rs15 off LMT
BP TUC 14.8g 16x18 [CP Rs. 15 off] LMT
BP Bakeri NK 19.2g 16x18 [CP Rs. 15 off] LMT
BP Prince Choco Jammies 23g 12x18 Rs.20
BP Prince Choco Jammies 23g 12x18 Rs.20 LMT
HR Gala Egg 30.6g x 8x30
HR Milco LU Waffle 30.0g 12x18 Rs 20
BP Milco LU Waffle 15.0G 24x18 Rs.10
HR Milco LU Waffle 30.0g 12x18 Rs 20 LMT
BP Milco LU Waffle 15.0G 24x18 Rs.10 LMT
B/P OREO Crumbs 100g 12x6 Rs 70
SP OREO Crumbs 250g 1x 24 Rs 150
SKU CLOSE
BP OREO Crumbs 100g 12x6 Rs 70 LMT
SP OREO Crumbs 250g 1x 24 Rs 150 LMT
FP OREO Crumbs 1000g 1x10 Rs 600 LMT
FP OREO Crumbs 1000g 1x10 Rs 600
BP Prince Chocolate 19g 16x18 [CP +2BP]
BP Oreo Original 19.0g 16x18 [CP+2BP]
BP OREO CHOCOLATE 19.0g 16x18 [CP+2BP]
BP Milco LU Waffle 20g 16X24[CP+2BP]Rs15
BP Prince Chocolate19g 16x18 [CP +2BP] LMT
BP Oreo Original 19.0g 16x18 [CP+2BP] LMT
BP OREO CHOCOLATE19.0g 16x18 [CP+2BP] LMT
BP Milco LU Waffle 20g 16X24[CP+2BP]Rs15 LMT
HR Zeera Plus 43.2g 8x18 Rs.30
HR Zeera Plus 43.2g 8x18 Rs.30 LMT
SP Candi CP Original 63.8G 6x18 [Nescafe]
SP Candi Original 63.8G 6x18 [CPNescafe] LMT
SP Wheatable High Fiber 64.8g 6x16 Rs.40
SP Wheatable High Fiber 64.8g 6x16 Rs.40 LMT
SP Bakeri Coconut 33g 6x18 Rs 40
BP Bakeri Bistiks 15g 16x18 Rs 15
SP Bakeri Coconut 33g 6x18 Rs 40 LMT
BP Bakeri Bistiks 15g 16x18 Rs 15 LMT
SP TUC 48.1g 6x18 Rs 40
SP TUC 48.1g 6x18 Rs 40 LMT
SP Bakeri Bistiks 45g 6x18 [CP Rs15 Off]
HR Bakeri Bistiks 30g 8x18 [CP Rs15Off]
TP Wheatable SF 19.0g 12x18 [CPRs.15 Off
SP Bakeri Bistiks 45g 6x18 [CP Rs15 Off] LMT
HR Bakeri Bistiks 30g 8x18 [CP Rs15Off] LMT
TP Wheatable SF 19.0g 12x18 [CPRs.15 Off LMT
TP Oreo Crispy 13g 24x18 Rs.10
TP TUC 11.1g 24x24 Rs.10
TP Bakeri NanKhatai 12.8g 24x24 Rs.10
TP Oreo Crispy 13g 24x18 Rs.10 LMT
TP TUC 11.1g 24x24 Rs. 10 LMT
TP Bakeri NanKhatai 12.8g 24x24 Rs.10 LMT
HR Prince Chocolate 38.0g 8x18 Rs.30
HR Prince Chocolate 38.0g 8x18 Rs.30 LMT
SP TUC 48.1g 6x30 + 1 Tang Sac [CP]
SP Wheatable HF 64.8g 6x16 [CP+W Cardamom]
BP TUC 14.8g 16x18 + 1 Tang Sac [CP]
SP TUC 48.1g 6x30 + 1 Tang Sac [CP] LMT
SP Wheatable HF 64.8g 6x16 [CP+W Cardamom] LMT
BP TUC 14.8g 16x18 + 1 Tang Sac [CP] LMT
SP Prince Chocolate 57.0g 6x24 Rs.40 TEST
BP Prince Mini Chocolate 13.2 16x24 Rs10
BP Prince Mini Chocolate 13.2 16x24 Rs10 LMT
HR Bakeri Bistiks 30.0g 8x18 Rs 30
HR Bakeri Bistiks 30.0g 8x18 Rs 30 LMT
BP Oreo Original 19g16x18 Rs.15 [CPRamdan]
BP Oreo Original 19g16x18 Rs.15 [CPRamdan] LMT
TP Zeera Plus 16.2g 24x18 Rs 10
BP Zeera Plus 16.2g 24x18 Rs 10 LMT
BP Tiger 24.0g 12+2 x24 [CP]
BP Tiger 24.0g 12+2 x24 [CP] LMT
BP Zeera Plus 21.6g 16+2 x18 [CP]
BP Zeera Plus 21.6g 16+2 x18 [CP] LMT
HR Bakeri Classic 37.36g 6x18 Rs.20
BP Bakeri Classic 18.68g 12x18 Rs.10
HR Bakeri Classic 37.36g 6x18 Rs.20 LMT
BP Bakeri Classic 18.68g 12x18 Rs.10 LMT
SP Candi Original 63.8g 6x18 Rs40 [CP 10 Off]
SP Candi Original 63.8g 6x18 Rs40 [CP 10 Off] LMT
SP Prince Chocolate 49.2g 6x24 Rs30[8.2g
BP Prince Chocolate 24.6g12x24 Rs15[8.2g
SP Prince Chocolate 49.2g 6x24 Rs30[8.2g - LMT
BP Prince Chocolate 24.6g12x24 Rs15[8.2g - LMT
T/P Belvita Bran 62g 12x6
T/P Belvita Kleija 62g 12x6
T/P Belvita Bran 62g 12x6 LMT
T/P Belvita Kleija 62g 12x6 LMT
HP Bakeri Classic 37.36g 6x18 Rs.20
BP Bakeri Classic 18.68g 12x18 Rs.10
HR Bakeri Classic 37.36g 6x18 Rs.20 LMT
BP Bakeri Classic 18.68g 12x18 Rs.10 LMT
HR Bakeri Classic 37.36g 8x18Rs20[RM0523
HR Bakeri Classic 37.36g 8x18Rs20[RM0523 LMT
BP Prince Chocolate 19g 16x18 Rs.15
BP Prince Chocolate 19g 16x18 Rs.15 LMT
BP Bakeri Nankhatai 19.2g 16x18 Rs.10
BP Bakeri Nankhatai 19.2g 16x18 Rs.10 LMT
BP Oreo Original 19g 16x18 Rs.15
BP OREO CHOCOLATE 19.0g 16x18 Rs.15
BP Oreo Original 19g 16x18 Rs.15 LMT
BP OREO CHOCOLATE 19.0g 16x18 Rs.15 LMT
BP Candi Original 23.2g16x18Rs15[CP10Off
TP Wheatable HF 21.6g12x24Rs15[CPRs10Off
BP Candi Original 23.2g16x18Rs15[CP10Off - LMT
TP Wheatable HF 21.6g12x24Rs15[CPRs10Off - LMT
SP Mini Oreo Original 27.5g 6x24 Rs.20
SP Mini Oreo Chocolate 27.5g 6x24 Rs.20
BP Mini Oreo Original 12.5g 12X24 Rs.10
BP Mini Oreo Chocolate 12.5g 12X24 Rs.10
SP Mini Oreo Original 27.5g 6x24 Rs.20 LMT
SP Mini Oreo Chocolate 27.5g 6x24 Rs.20 LMT
BP Mini Oreo Original 12.5g 12X24 Rs.10 LMT
BP Mini Oreo Chocolate 12.5g 12X24 Rs.10 LMT
BP Prince Choco Jammies 23g 12x18 Rs.25
BP Prince Choco Jammies 23g 12x18 Rs.25 LMT
SP Prince Mini Fingers 17.28g 12x18 Rs20
BP Prince Mini Fingers 7.68g 12x24 Rs10
SP Prince Mini Fingers 17.28g 12x18 Rs20 LMT
BP Prince Mini Fingers 7.68g 12x24 Rs10 LMT
SP Milco LU Waffle 40.0g 8x18 Rs.30
BP Prince Mini Choc 13.2g 24x18 Rs10
TP Milco LU Waffle 15g 24x18 Rs.10
SP Milco LU Waffle 40.0g 8x18 Rs.30 LMT
BP Prince Mini Choc 13.2g 24x18 Rs10 LMT
TP Milco LU Waffle 15g 24x18 Rs.10 LMT
SP Milco LU 45g 10x18 Rs25
BP Milco LU 22.5g 16x18 Rs15
SP Milco LU 45g 10x18 Rs25 LMT
BP Milco LU 22.5g 16x18 Rs15 LMT
SP Wheatable High Fiber 64.8g 6x16 [CP 10Off]
BP Gala Egg 20.4g 1x72 CP 3BP
SP Wheatable High Fiber 64.8g 6x16 [CP 10Off] LMT
BP Gala Egg 20.4g 1x72 CP 3BP LMT
BP Gala Egg 20.4g 1x75 CP 3BP
SP Tiger 48g 6x24 Rs. 20
SP Tiger 48g 6x24 Rs. 20 LMT
FP Zeera Plus 108.0g 1x96 Rs 80
BP TUC 22.2g 12x18 Rs.20
BP Bakeri Bistiks 20g 16x18 Rs 20
BP Bakeri Nankhatai 25.6g 12x18 Rs.20
FP Zeera Plus 108.0g 1x96 Rs 80 LMT
BP TUC 22.2g 12x18 Rs.20 LMT
BP Bakeri Bistiks 20g 16x18 Rs 20 LMT
BP Bakeri Nankhatai 25.6g 12x18 Rs.20 LMT
SP Prince Chocolate 57g 6x24Rs.40[CPActBook
BP Prince Mini Choc 13.2g24x18Rs10 CPActBo
SP Prince Chocolate 57g6x24Rs.40[CPActBook LMT
BP Prince Mini Choc 13.2g24x18Rs10 CPActBo LMT
BP Prince Mini Choc 13.2g 24x18 [CP]
BP Prince Mini Choc 13.2g 24x18 [CP] LMT
TP Tiger 12.0g 48x18 Rs 5
TP Tiger 12.0g 48x18 Rs 5 LMT
BP Bakeri Nankhatai 25.6g12x18Rs.20[CPPoet
BP Bakeri Nankhatai 25.6g12x18Rs.20[CPPoet LMT
SP Bakeri NanKhatai 51.2g6x18Rs.40[CPPoet
SP Bakeri NanKhatai 51.2g6x18Rs.40[CPPoet LMT
FP Candi Original 116.0g 1x96 Rs 80
FP Gala Egg 102g 1x96 Rs 80
FP Candi Original 116.0g 1x96 Rs 80 LMT
FP Gala Egg 102g 1x96 Rs 80 LMT
SP Bakeri NanKhatai 51.2g6x18Rs.40[CPPoet
BP Bakeri Nankhatai 25.6g12x18Rs.20[CPPoet
SP Bakeri NanKhatai 51.2g6x18Rs.40[CPPoet LMT
BP Bakeri Nankhatai 25.6g12x18Rs.20[CPPoet LMT
SP TUC Bites Masala 26.7g 1x18 Rs.40
SP TUC Bites Sour Cream 25.5g 1x18 Rs.40
SP TUC Bites Salt & Pep 27g 1x18 Rs.40
BP TUC Bites Masala 12.4g 1x24 Rs.20
BP TUC Bites Sour Cream 10.9g 1x24 Rs.20
BP TUC Bites Salt & Pep 12.6g 1x24 Rs.20
SP TUC Bites Masala 26.7g 1x18 Rs.40 LMT
SP TUC Bites Sour Cream 25.5g 1x18 Rs.40 LMT
SP TUC Bites Salt & Pep 27g 1x18 Rs.40 LMT
BP TUC Bites Masala 12.4g 1x24 Rs.20 LMT
BP TUC Bites Sour Cream 10.9g 1x24 Rs.20 LMT
BP TUC Bites Salt & Pep 12.6g 1x24 Rs.20 LMT
HR Gala Egg 40.8g 10X24 Rs20 [CP+1BP]
HR Gala Egg 40.8g 10X24 Rs20 [CP+1BP] LMT
SP Zeera Plus 59.4g 6x24 Rs 40 [CP Tapal
SP Zeera Plus 59.4g 6x24 Rs 40
SP Zeera Plus 59.4g 6x24 Rs 40 LMT
SP Zeera Plus 59.4g 6x24 Rs 40 [CP Tapal LMT
BP Candi Original 17.4g 24x24 Rs10
BP Candi Original 17.4g 24x24 Rs10 LMT
FP TUC 81.4g 1x96 Rs 80
SP Candi Original 58.0g 6x18 Rs.40
SP Milco LU 45g 10x18 Rs30
TP Junior Prince 12g 24x18 Rs.10
FP TUC 81.4g 1x96 Rs 80 LMT
SP Candi Original 58.0g 6x18 Rs.40 LMT
SP Milco LU 45g 10x18 Rs30 LMT
TP Junior Prince 12g 24x18 Rs.10 LMT
HR Gala Egg 40.8g 1x24 Rs.20 CP 1
HR Gala Egg 40.8g 1x24 Rs.20 CP 1 LMT
BP Prince Chocolate 28.5g 12x18 Rs.20
BP Zeera Plus 32.4g 12x18 Rs.20
BP Candi Original 34.8g 12x18 Rs20
BP Prince Chocolate 28.5g 12x18 Rs.20 LMT
BP Candi Original 34.8g 12x18 Rs20 LMT
BP Zeera Plus 32.4g 12x18 Rs.20 LMT
SP Oreo Orig CP Lunchbox 38g20x12Rs.30
SP Oreo Original 38g20x12Rs.30[CPLunchbox] LMT
BP Bakeri Bistiks 20g 12x18 Rs 20
BP Bakeri Bistiks 20g 12x18 Rs 20 LMT
Candi Crush 1000gm 1x10 Engro OOH
FP Prince Chocolate 95g 1x96 Rs.90
FP Oreo Original 76.0g 1x96 Rs.90
FP TUC 81.4g 1x96 Rs 90
FP Candi Original 116g 1x96 Rs 90
FP Gala Egg 102g 1x96 Rs 90
FP Zeera Plus 108.0g 1x96 Rs 90
FP Bakeri Butter 66g 1x96 Rs. 90
FP Bakeri Coconut 66g 1x96 Rs.90
FP Bakeri Bistiks 65g 1x96 Rs.90
FP Bakeri Nan Khatai 89.6g 1x96 Rs.90
FP Prince Chocolate 95g 1x96 Rs.90 LMT
FP Oreo Original 76.0g 1x96 Rs.90 LMT
FP TUC 81.4g 1x96 Rs 90 LMT
FP Candi Original 116g 1x96 Rs 90 LMT
FP Gala Egg 102g 1x96 Rs 90 LMT
FP Zeera Plus 108.0g 1x96 Rs 90 LMT
FP Bakeri Butter 66g 1x96 Rs. 90 LMT
FP Bakeri Coconut 66g 1x96 Rs.90 LMT
FP Bakeri Bistiks 65g 1x96 Rs.90 LMT
FP Bakeri Nan Khatai 89.6g 1x96 Rs.90 LMT
SP OREO CHOCOLATE 38.0g 8x18 Rs40
SP Mini Oreo Original 20g 15x18 Rs.20
SP Mini Oreo Chocolate 20g 15x18 Rs.20
BP OREO CHOCOLATE 19.0g 16x18 Rs20
BP Mini Oreo Original 10g 30X18 Rs.10
BP Mini Oreo Chocolate 10g 30X18 Rs.10
SP OREO CHOCOLATE 38.0g 8x18 Rs40 LMT
SP Mini Oreo Original 20g 15x18 Rs.20 LMT
SP Mini Oreo Chocolate 20g 15x18 Rs.20 LMT
BP OREO CHOCOLATE 19.0g 16x18 Rs20 LMT
BP Mini Oreo Original 10g 30X18 Rs.10 LMT
BP Mini Oreo Chocolate 10g 30X18 Rs.10 LMT
SP Prince Mini Fingers 19.2g 12x18 Rs20 LMT
BP Prince Choco Jammies 23g 12x18 Rs.30 LMT
BP Prince Mini Fingers 9.6g 12x24 Rs 10 LMT
TP Prince Enrobe 20g 12x18 Rs. 25 LMT
SP Prince Mini Fingers 19.2g 12x18 Rs20
BP Prince Choco Jammies 23g 12x18 Rs.30
BP Prince Mini Fingers 9.6g 12x24 Rs 10
TP Prince Enrobe 20g 12x18 Rs. 25
BP Tiger 24.0g 30x18 Rs 10
BP Tiger 24.0g 30x18 Rs 10 LMT
SP TUC 44.4g 6x24 [CP+BP22.2g] RS 40
SP TUC 44.4g 6x18 [CP+TUC Bites Rs10] RS 40
SP Wheatable SF 38.0g 6x18 [CPRs10off] RS 40
SP TUC 44.4g 6x24  [CP+BP22.2g] RS 40 LMT
SP TUC 44.4g 6x18 [CP+TUC Bites Rs10] RS 40 LMT
SP Wheatable SF 38.0g 6x18 [CPRs10off] RS 40 LMT
SP Bakeri Butter 33g 6x24 Rs.50
SP Bakeri Coconut 33g 6x18 Rs.50
HR Bakeri Butter With Tray 22g 8x24 Rs.30
HR Bakeri Coconut 22g 8x24 Rs.30
TP Oreo Crispy 13g 30x18 Rs.10
SP Bakeri Butter 33g 6x24 Rs.50 LMT
SP Bakeri Coconut 33g 6x18 Rs.50 LMT
HR Bakeri Butter With Tray 22g 8x24 Rs.30 LMT
HR Bakeri Coconut 22g 8x24 Rs.30 LMT
TP Oreo Crispy 13g 30x18 Rs.10 LMT
BP Mini OreoOriginal 10g24x12Rs10[CPPBox
BP Mini Oreo Orginal 10g12x24Rs10[CPErsr
BP Mini Oreo Chocolate 10g24x12Rs10[CPPBox
BP Mini Oreo Chocolate 10g12x24Rs10[CPErsr
BP Mini OreoOriginal 10g24x12Rs10[CPPBox LMT
BP Mini Oreo Orginal 10g12x24Rs10[CPErsr LMT
BP Mini Oreo Chocolate 10g24x12Rs10[CPPBox LMT
BP Mini Oreo Chocolate 10g12x24Rs10[CPErsr LMT
FP Wheatable HighFiber129.6g 1x48 Rs.100
FP Wheatable SF 85.5g 1x48 Rs.100
FP Wheatable HighFiber129.6g 1x48 Rs.100 - LMT
FP Wheatable SF 85.5g 1x48 Rs.100 - LMT
SP Candi Original 58.0g 8x18 Rs.40
SP Gala Egg 56.1g 10x18
SP Bakeri Nankhatai 44.8g 8x18 Rs. 40
SP Wheatable High Fiber 64.8g 6x18 Rs.50
SP Wheatable SF 38.0g 6x18 Rs.50
HR Candi Original 46.4g 10x18 Rs. 30
HR Wheatable Cardamom 21.6g 15x18
HR Wheatable High Fiber 43.2g 8X18 Rs.40
BP Prince Mini Choc 11.0g 24x18
TP Candi Original 17.4g 30x18 Rs10
BP Candi Original 34.8g 15x18 Rs20
BP Bakeri Nankhatai 25.6g 15x18 Rs.20
SP Candi Original 58.0g 8x18 [CPNescafe]
TP Bakeri NanKhatai 12.8g 30x18 Rs.10
TP Wheatable High Fiber 21.6g 15x18 Rs.20
TP Wheatable SF 19.0g 15x18 Rs.20
FP Zeera Plus 129.6g 1x96 [CP 20% Extra]
BP Gala Egg 20.4g 1x73 CP 2BP
SP Candi Original 58.0g 8x18 Rs.40 LMT
SP Gala Egg 56.1g 10x18 LMT
SP Bakeri Nankhatai 44.8g 8x18 Rs. 40 LMT
SP Wheatable High Fiber 64.8g 6x18 Rs.50 LMT
SP Wheatable SF 38.0g 6x18 Rs.50 LMT
HR Candi Original 46.4g 10x18 Rs. 30 LMT
HR Wheatable Cardamom 21.6g 15x18 LMT
HR Wheatable High Fiber 43.2g 8X18 Rs.40 LMT
BP Prince Mini Choc 11.0g 24x18 LMT
TP Candi Original 17.4g 30x18 Rs10 LMT
BP Candi Original 34.8g 15x18 Rs20 LMT
BP Bakeri Nankhatai 25.6g 15x18 Rs.20 LMT
SP Candi Original 58.0g 8x18 [CPNescafe] LMT
TP Bakeri NanKhatai 12.8g 30x18 Rs.10 LMT
TP Wheatable High Fiber 21.6g 15x18 Rs.20 LMT
TP Wheatable SF 19.0g 15x18 Rs.20 LMT
FP Zeera Plus 129.6g 1x96 [CP 20% Extra] LMT
BP Gala Egg 20.4g 1x73 CP 2BP LMT
SP TUC 44.4g 8x18 Rs. 40
SP Bakeri Butter 33g 6x18 Rs.50
SP Bakeri Coconut 33g 6x18 Rs.50
SP Bakeri Bistiks 45g 8x18 Rs 40
HR Bakeri Butter With Tray 22g10x18 Rs.30
HR Bakeri Coconut 22g 10x18 Rs.30
HR Bakeri Classic 37.36g 15x18 Rs.20
BP Tiger 18.0g 30x18 Rs 10
BP TUC 22.2g 15x18 Rs.20
BP Bakeri Classic 18.68g 30x18 Rs.10
BP Bakeri Bistiks 20g 15x18 Rs 20
TP TUC 11.1g 30x18 Rs. 10
SP TUC 44.4g 8x18 Rs. 40 LMT
SP Bakeri Butter 33g 6x18 Rs.50 LMT
SP Bakeri Coconut 33g 6x18 Rs.50 LMT
SP Bakeri Bistiks 45g 8x18 Rs 40 LMT
HR Bakeri Butter With Tray 22g10x18 Rs.30 LMT
HR Bakeri Coconut 22g 10x18 Rs.30 LMT
HR Bakeri Classic 37.36g 15x18 Rs.20 LMT
BP Tiger 18.0g 30x18 Rs 10 LMT
BP TUC 22.2g 15x18 Rs.20 LMT
BP Bakeri Classic 18.68g 30x18 Rs.10 LMT
BP Bakeri Bistiks 20g 15x18 Rs 20 LMT
TP TUC 11.1g 30x18 Rs. 10 LMT
BP Mini Oreo Chocolate 10g 12X24 Rs.10
BP Mini Oreo Chocolate 10g 12X24 Rs.10 - LMT
Candi Crush 450g LMT
BP Prince Mini Fingers 9.6g 24x18 Rs.10
BP Prince Mini Fingers 9.6g 24x18 Rs.10 - LMT
SP Wheatable SF 38.0g 6x18 Rs50 [CPRs10]
SP Wheatable SF 38.0g 6x18 Rs50 [CPRs10] - LMT
MP Mini Oreo Original 100g 1x48 Rs.100
MP Mini Oreo Original 100g 1x48 Rs.100 LMT
SP Zeera Plus 59.4g 8x18 Rs 40
SP Zeera Plus 59.4g 8x18 Rs 40 LMT
FP Tiger 96g 1x96
FP Tiger 96g 1x96 LMT
SP TUC Bites Masala 26.7g 24x4 Rs.40
SP TUC Bites SourCream&On 25.48g 24x4Rs40
SP TUC Bites Salt&Pepper 27g 24x4 Rs.40
BP TUC Bites Masala 12.4g 48x4 Rs.20
BP TUC Bites SourCream&On 10.92g48x4Rs20
BP TUC Bites Salt&Pepper 12.6g 48x4 Rs20
SP TUC Bites Masala 26.7g 24x4 Rs.40 LMT
SP TUC Bites SourCream&On 25.48g 24x4Rs40 LMT
SP TUC Bites Salt&Pepper 27g 24x4 Rs.40 LMT
BP TUC Bites Masala 12.4g 48x4 Rs.20 LMT
BP TUC Bites SourCream&On 10.92g48x4Rs20 LMT
BP TUC Bites Salt&Pepper 12.6g 48x4 Rs20 LMT
OREO Shell Crumbs 1000g 1x 10 OOH
Candi Crush St Pouch 1000gm 1x10 OOH
SP Oreo Original 38.0g 10x24 Rs. 30 OOH
SP Wheatable High Fiber 64.8g 6x16 Rs.50
SP Wheatable High Fiber 64.8g 6x16 Rs.50 LMT
SP Wheatable High Fiber 64.8g 6x16 Rs.50 OOH
SP Wheatable SF 38.0g 6x18 Rs.50 OOH
SP Candi Original 58.0g 6x18 Rs.40 OOH
HR Wheatable High Fiber 43.2g 8X24 Rs.40
HR Wheatable High Fiber 43.2g 8X24 Rs.40 LMT
HR Zeera Plus 43.2g 10x18 Rs.30
BP Oreo Original 19g 20x18 Rs.15
HR Zeera Plus 43.2g 10x18 Rs.30 LMT
BP Oreo Original 19g 20x18 Rs.15 LMT
BP Tiger 18.0g 30x18 Rs.10 (2+2+2
BP Zeera Plus 21.6g 20x18 Rs.15
BP Tiger 18.0g 30x18 Rs.10 (2+2+2) LMT
BP Zeera Plus 21.6g 20x18 Rs.15 LMT
BP Tiger 18.0g 30x18 Rs.10 (2+2+2) OOH
BP Zeera Plus 21.6g 20x18 Rs.15 OOH
SP TUC 44.4g 6x24 CP BP22.2g MD
SP TUC 44.4g 6x18 CP TUC Bites Rs10 MD
SP Wheatable SF 38.0g 6x18 CPRs10off MD
OREO Crumbs 1000g 1x10 Rs 850 OOH
0
0
0
0
0
SP Prince Choc 57g6x24 6SP+1TucBiteRs20cpMD
SP TUC 44.4g 8x18 (8SP+1 TucBites Rs20CP)MD
SP Candi 58.0g 8x18 8SP+1 Tuc Bites Rs20CPMD
SP BakeriBistiksSP45g8x18 8sp+1TucBite.rs20MD
BP Tiger BP 18.0g (30+2)x18 Rs10[CP] 2+2+2MD
SP Prince Choc 57g6x24 6SP+1TucBiteRs20cp
SP TUC 44.4g 8x18 (8SP+1 TucBites Rs20CP)
SP Candi 58.0g 8x18 8SP+1 Tuc Bites Rs20CP
SP BakeriBistiksSP45g8x18 8sp+1TucBite.rs20
BP Tiger BP 18.0g (30+2)x18 Rs10[CP] 2+2+2
SP Prince Choc 57g6x24 6SP+1TucBiteRs20cpLMT
SP TUC 44.4g 8x18 (8SP+1 TucBites Rs20CP)LMT
SP Candi 58.0g 8x18 8SP+1 Tuc Bites Rs20CPLMT
SP BakeriBistiksSP45g8x18 8sp+1TucBite.rs20LMT
BP Tiger BP 18.0g (30+2)x18 Rs10[CP] 2+2+2LMT
SP Prince Choc 57g6x24 6SP+1TucBiteRs20cpOOH
SP TUC 44.4g 8x18 (8SP+1 TucBites Rs20CP)OOH
SP Candi 58.0g 8x18 8SP+1 Tuc Bites Rs20CPOOH
SP BakeriBistiksSP45g8x18 8sp+1TucBite.rs20OOH
BP Tiger BP 18.0g (30+2)x18 Rs10[CP] 2+2+2OOH
SP Wheatable High Fiber 64.8g 6x18 Rs.50 OOH
SP Prince Mini Fingers19.2g6x24Rs20 OldPM MD
SP Zeera Plus 59.4g 8x18 Rs40 CP TapalRs20 MD
SP Prince Mini Fingers 19.2g6x24 Rs20 OldPM
SP Zeera Plus 59.4g 8x18 Rs40 CPTapal Rs20
SP Prince Mini Fingers 19.2g6x24 Rs20 OldPM LMT
SP Zeera Plus 59.4g 8x18 Rs40 CPTapal Rs20 LMT
SP Prince Mini Fingers 19.2g6x24 Rs20 OldPM OOH
SP Zeera Plus 59.4g 8x18 Rs40 CPTapal Rs20 OOH
SP Prince Chocolate 57g6x24Rs40[CP+BPRs15 MD
SP OREO CHOCOLATE 38g 9x18Rs40[CP MD
TP Junior Prince 12g 26x18 CP MD
SP Prince Chocolate 57g6x24Rs40[CP+BPRs15
SP OREO CHOCOLATE 38g 9x18Rs40[CP
TP Junior Prince 12g 26x18 CP
SP Prince Chocolate 57g6x24Rs40[CP+BPRs15 LMT
SP OREO CHOCOLATE 38g 9x18Rs40[CP LMT
TP Junior Prince 12g 26x18 CP LMT
SP Prince Chocolate 57g6x24Rs40[CP+BPRs15 OOH
SP OREO CHOCOLATE 38g 9x18Rs40[CP OOH
TP Junior Prince 12g 26x18 CP OOH
TP WheatableCardamom 21.6g15x18Rs20 CP15Of MD
TP WheatableCardamom 21.6g15x18Rs20 CP15Of
TP WheatableCardamom 21.6g15x18Rs20 CP15Of LMT
TP WheatableCardamom 21.6g15x18Rs20 CP15Of OOH
SP Mini Oreo Original 20g 6x24Rs20 OldPM
SP Mini Oreo Original 20g 6x24Rs20 OldPM LMT
SP Mini Oreo Original 20g 6x24Rs20 OldPM OOH
PPPP
PPPPP
SP TUC Bites Rs.40 2 PLUS 1
BP TUC Bites Rs.20 2 PLUS 1
VP Gala Egg 71.4g 8x18 Rs.40
SP Tiger 36.0g 15x18 Rs.20 On Pile
VP Gala Egg 71.4g 8x18 Rs.40 MD
SP Tiger 36.0g 15x18 Rs.20 On Pile MD
VP Gala Egg 71.4g 8x18 Rs.40 LMT
SP Tiger 36.0g 15x18 Rs.20 on Pile LMT
VP Gala Egg 71.4g 8x18 Rs.40 OOH
SP Tiger 36.0g 15x18 Rs.20 On Pile OOH
BP TUC 22.2g 15x18 Rs.20 CP 1 TucBite Rs 40
BP TUC 22.2g 15x18 Rs.20 CP 1Tuc Bite Rs 40 MD
BP TUC 22.2g 15x18 Rs.20 CP 1 Tuc Bite Rs 40 LMT
BP TUC 22.2g 15x18 Rs.20 CP 1 Tuc Bite Rs 40 OOH
SP Mini Oreo Chocolate 20g 6x24 Rs20 OldPM
SP Mini Oreo Chocolate 20g 6x24 Rs20 OldPM MD
SP Mini Oreo Chocolate 20g 6x24 Rs20 OldPM LMT
SP Mini Oreo Chocolate 20g 6x24 Rs20 OldPM OOH
SP TUC 44.4g 8x18 Rs40 CP Tang
SP Bakeri Nankhatai 44.8g 8x18 Rs40 CPTBite20
BP TUC 22.2g 15x18 Rs.20 CP Tang
SP TUC 44.4g 8x18 Rs40 CP Tang MD
SP Bakeri Nankhatai 44.8g 8x18 Rs40 CPTBite20 MD
BP TUC 22.2g 15x18 Rs.20 CP Tang MD
SP TUC 44.4g 8x18 Rs40 CP Tang LMT
SP Bakeri Nankhatai 44.8g 8x18 Rs40 CPTBite20 LMT
BP TUC 22.2g 15x18 Rs.20 CP Tang LMT
SP TUC 44.4g 8x18 Rs40 CP Tang OOH
SP Bakeri Nankhatai 44.8g 8x18 Rs40 CPTBite20 OOH
BP TUC 22.2g 15x18 Rs.20 CP Tang OOH
HR Prince Chocolate 38.0g 10x18 Rs.30
BP Zeera Plus 32.4g 15x18 Rs.20
HR Prince Chocolate 38.0g 10x18 Rs.30 MD
BP Zeera Plus 32.4g 15x18 Rs.20 MD
HR Prince Chocolate 38.0g 10x18 Rs.30 LMT
BP Zeera Plus 32.4g 15x18 Rs.20 LMT
HR Prince Chocolate 38.0g 10x18 Rs.30 OOH
BP Zeera Plus 32.4g 15x18 Rs.20 OOH
BP Gala Egg 20.4g 4x1x72 CP 3BP
SP OREO CHOCOLATE 38.0g 8x18 Rs40 MD
HR Gala Egg 40.8g 1x24 Rs.20 CP+1 MD
BP Gala Egg 20.4g 1x73 CP 2BP MD
SP Wheatable High Fiber 64.8g 6x16 CP 10Off MD
SP Mini Oreo Chocolate 20g 15x18 Rs.20
SP Mini Oreo Chocolate 20g 15x18 Rs.20 LMT
SP Prince Coco Choc SP 24g 6x24 Rs.20 MD
SP Prince Coco Choc SP 24g 6x24 Rs.20 OOH
SP Prince Mini Fingers 19.2g 12x18 Rs20 MD
BP Prince Choco Jammies 23g 12x18 Rs.30 MD
BP Prince Mini Fingers 9.6g 24x18 Rs.10 MD
BP Prince Mini Star 18.0g 12x18 Rs.20 MD
TP Prince Enrobe 20g 12x18 Rs. 25 MD
BP Prince Coco Choc 19g 6x24 Rs20
SP Milco LU Waffle 41.6g 10x18 Rs.30
BP Milco LU Waffle 20.0G 15x18 Rs.20
TP Milco LU Waffle 10g 30x18 Rs.10
BP Prince Coco Choc 19g 6x24 Rs20 MD
SP Milco LU Waffle 41.6g 10x18 Rs.30 MD
BP Milco LU Waffle 20.0G 15x18 Rs.20 MD
TP Milco LU Waffle 10g 30x18 Rs.10 MD
BP Prince Coco Choc 19g 6x24 Rs20 LMT
SP Milco LU Waffle 41.6g 10x18 Rs.30 LMT
BP Milco LU Waffle 20.0G 15x18 Rs.20 LMT
TP Milco LU Waffle 10g 30x18 Rs.10 LMT
BP Prince Coco Choc 19g 6x24 Rs20 OOH
SP Milco LU Waffle 41.6g 10x18 Rs.30 OOH
BP Milco LU Waffle 20.0G 15x18 Rs.20 OOH
TP Milco LU Waffle 10g 30x18 Rs.10 OOH
SP B.NanKhatai 44.8g 8x18 Rs.40+1GalaRs20
SP B.NanKhatai 44.8g 8x18 Rs.40+1GalaRs20 MD
SP B.NanKhatai 44.8g 8x18 Rs.40+1GalaRs20 LMT
SP B.NanKhatai 44.8g 8x18 Rs.40+1GalaRs20 OOH
BP Prince Chocolate 19g 20x18 Rs 15 CP+2BP
BP Prince Chocolate 19g 20x18 Rs 15 CP+2BP MD
BP Prince Chocolate 19g 20x18 Rs 15 CP+2BP LMT
BP Prince Chocolate 19g 20x18 Rs 15 CP+2BP OOH
MP Mini Oreo Chocolate 100g 1x48 Rs.100
MP Mini Oreo Chocolate 100g 1x48 Rs.100 MD
MP Mini Oreo Chocolate 100g 1x48 Rs.100 LMT
MP Mini Oreo Chocolate 100g 1x48 Rs.100 OOH
BP OREO CHOCOLATE 19g 16x18 Rs20 CP+2BP
TP Oreo Crispy 13g 30x18 Rs10 CP+2TP
BP OREO CHOCOLATE 19g 16x18 Rs20 CP+2BP MD
TP Oreo Crispy 13g 30x18 Rs10 CP+2TP MD
BP OREO CHOCOLATE 19g 16x18 Rs20 CP+2BP LMT
TP Oreo Crispy 13g 30x18 Rs10 CP+2TP LMT
BP OREO CHOCOLATE 19g 16x18 Rs20 CP+2BP OOH
TP Oreo Crispy 13g 30x18 Rs10 CP+2TP OOH
TP Wheatable HF 21.6g 15x18 Rs20 CP+1TP
TP Wheatable HF 21.6g 15x18 Rs20 CP+1TP MD
TP Wheatable HF 21.6g 15x18 Rs20 CP+1TP LMT
TP Wheatable HF 21.6g 15x18 Rs20 CP+1TP OOH
FP Zeera Plus 108g 1x96Rs90 LEPGuftugu
SP Zeera Plus 59.4g 8x18Rs40 LEPGuftug
FP Zeera Plus 108g 1x96Rs90 LEPGuftugu MD
SP Zeera Plus 59.4g 8x18Rs40 LEPGuftug MD
FP Zeera Plus 108g 1x96Rs90 LEPGuftugu LMT
SP Zeera Plus 59.4g 8x18Rs40 LEPGuftug LMT
FP Zeera Plus 108g 1x96Rs90 LEPGuftugu OOH
SP Zeera Plus 59.4g 8x18Rs40 LEPGuftug OOH
SP TUC 44.4g 8x18 Rs 40 CP Candi BP 34.8 Rs20
SP TUC 44.4g 8x18 Rs 40 CP Candi BP 34.8 Rs20 MD
SP TUC 44.4g 8x18 Rs 40 CP Candi BP 34.8 Rs20 LMT
SP TUC 44.4g 8x18 Rs 40 CP Candi BP 34.8 Rs20 OOH
BP Prince Chocolate 19g 20x18 Rs15 (1+1)
BP Prince Chocolate 19g 20x18 Rs15 (1+1) MD
BP Prince Chocolate 19g 20x18 Rs15 (1+1) LMT
BP Prince Chocolate 19g 20x18 Rs15 (1+1) OOH
SP Oreo Original 38g10x24Rs30 LEPMonoply
BP Oreo Original 19g20x18Rs15 LEPMonoply
SP Oreo Original 38g10x24Rs30 LEPMonoply MD
BP Oreo Original 19g20x18Rs15 LEPMonoply MD
SP Oreo Original 38g10x24Rs30 LEPMonoply LMT
BP Oreo Original 19g20x18Rs15 LEPMonoply LMT
SP Oreo Original 38g10x24Rs30 LEPMonoply OOH
BP Oreo Original 19g20x18Rs15 LEPMonoply OOH
TP Bakeri NanKhatai 12.8g 24x18 Rs.10
TP Bakeri NanKhatai 12.8g 24x18 Rs.10 MD
TP Bakeri NanKhatai 12.8g 24x18 Rs.10 LMT
TP Bakeri NanKhatai 12.8g 24x18 Rs.10 OOH
BP Prince Jumbo 41.0g 6x18 Rs50
BP Bakeri Classic 37.36g 12x18 Rs.20
BP Bakeri NanKhatai 25.6g 12x18 Rs.20
TP Oreo Crispy Chocolate 13g 24x18 Rs.10
TP Bakeri Classic 18.68g 24x18 Rs.10
BP Prince Jumbo 41.0g 6x18 Rs50 MD
BP Bakeri Classic 37.36g 12x18 Rs.20 MD
BP Bakeri NanKhatai 25.6g 12x18 Rs.20 MD
TP Oreo Crispy Chocolate 13g 24x18 Rs.10 MD
TP Bakeri Classic 18.68g 24x18 Rs.10 MD
BP Prince Jumbo 41.0g 6x18 Rs50 LMT
BP Bakeri Classic 37.36g 12x18 Rs.20 LMT
BP Bakeri NanKhatai 25.6g 12x18 Rs.20 LMT
TP Oreo Crispy Chocolate 13g 24x18 Rs.10 LMT
TP Bakeri Classic 18.68g 24x18 Rs.10 LMT
BP Prince Jumbo 41.0g 6x18 Rs50 OOH
BP Bakeri Classic 37.36g 12x18 Rs.20 OOH
BP Bakeri NanKhatai 25.6g 12x18 Rs.20 OOH
TP Oreo Crispy Chocolate 13g 24x18 Rs.10 OOH
TP Bakeri Classic 18.68g 24x18 Rs.10 OOH
SP Milco LU 45g 8x18 Rs 40
BP Milco LU 22.5g 16x18 Rs.20
SP Milco LU 45g 8x18 Rs 40 MD
BP Milco LU 22.5g 16x18 Rs.20 MD
SP Milco LU 45g 8x18 Rs 40 LMT
SP Milco LU 45g 8x18 Rs 40 OOH
SP Candi Orginal 58g 6x18 Rs40 LEP Fist
SP Candi Orginal 58g 6x18 Rs40 LEP Fist MD
SP Candi Orginal 58g 6x18 Rs40 LEP Fist LMT
SP Candi Orginal 58g 6x18 Rs40 LEP Fist OOH
BP Milco LU 22.5g 16x18 Rs.20 MD
BP Milco LU 22.5g 16x18 Rs.20 OOH
BP Milco LU 22.5g 16x18 Rs.20 LMT
SP Wheatable SF 38g 6x18 Rs50 CPTapalGT
SP Wheatable SF 38g 6x18 Rs50 CPTapalGT MD
SP Wheatable SF 38g 6x18 Rs50 CPTapalGT LMT
SP Wheatable SF 38g 6x18 Rs50 CPTapalGT OOH
BP Mini Oreo Original 10.0g 24x18 Rs.10
BP Mini Oreo Chocolate 10.0g 24x18 Rs.10
BP Mini Oreo Original 10.0g 24x18 Rs.10 MD
BP Mini Oreo Chocolate 10.0g 24x18 Rs.10 MD
BP Mini Oreo Original 10.0g 24x18 Rs.10 LMT
BP Mini Oreo Chocolate 10.0g 24x18 Rs.10 LMT
BP Mini Oreo Original 10.0g 24x18 Rs.10 OOH
BP Mini Oreo Chocolate 10.0g 24x18 Rs.10 OOH
BP Tiger 18g30x18Rs10 CPOreoCrispyChoc 2
BP Tiger 18g30x18Rs10 CPOreoCrispyChoc 2 MD
BP Tiger 18g30x18Rs10 CPOreoCrispyChoc 2 LMT
BP Tiger 18g30x18Rs10 CPOreoCrispyChoc 2 OOH
FP Bakeri NanKhatai 89.6g 1x96Rs90 NewAW
SP Bakeri NanKhatai 44.8g 8x18Rs40 NewAW
FP Bakeri NanKhatai 89.6g 1x96Rs90 NewAW MD
SP Bakeri NanKhatai 44.8g 8x18Rs40 NewAW MD
FP Bakeri NanKhatai 89.6g 1x96Rs90 NewAW LMT
SP Bakeri NanKhatai 44.8g 8x18Rs40 NewAW LMT
FP Bakeri NanKhatai 89.6g 1x96Rs90 NewAW OOH
SP Bakeri NanKhatai 44.8g 8x18Rs40 NewAW OOH
BP Milco LU Waffle 20.8g 15x18 Rs20 CP+3
BP Milco LU Waffle 20.8g 15x18 Rs20 CP+3 MD
BP Milco LU Waffle 20.8g 15x18 Rs20 CP+3 LMT
BP Milco LU Waffle 20.8g 15x18 Rs20 CP+3 OOH
SP Tiger 36g 6x24 Rs20 CP 2SP
SP Tiger 36g 6x24 Rs20 CP 2SP MD
SP Tiger 36g 6x24 Rs20 CP 2SP LMT
SP Tiger 36g 6x24 Rs20 CP 2SP OOH
SP Tiger 36g 6x24 Rs20 CP 2SP ECom
HR Bakeri Classic 37.36g 15x18 Rs.20 Ecom
BP Prince Jumbo 41.0g 6x18 Rs50 Ecom
BP Bakeri Classic 18.68g 30x18 Rs.10 Ecom
SP Prince Chocolate 57g 6x24 Rs50
SP Prince Chocolate 57g 6x24 Rs50 (CAMA)
HR Prince Chocolate 38.0g 6x18 Rs.40
BP Prince Chocolate 19g 12x18 Rs20 (1+1)
BP Prince Jumbo 41.0g 6x18 Rs40
BP Prince Coco Choc 24g 6x24 Rs30
TP Prince Enrobed 20g 12x18 Rs. 30
VP Zeera Plus 70.2g 6x18 Rs.50[CPTapal]
SP Zeera Plus 54g 8x18 Rs40 [CPTapalRs20
SP BakeriNankhatai 44.8g8x18Rs40 CPTapal10
VP Zeera Plus 70.2g 6x18 Rs.50
SP Zeera Plus 54g 8x18 Rs 40
HR Zeera Plus 32.4g 10x18 Rs.30
BP Zeera Plus 21.6g 12x18 Rs.20
TP Candi Original 11.6g 24x18 Rs.10
TP Zeera Plus 10.8g 24x18 Rs.10
SP Prince Chocolate 57g 6x24 Rs50 MD
SP Prince Chocolate 57g 6x24 Rs50 (CAMA) MD
HR Prince Chocolate 38.0g 6x18 Rs.40 MD
BP Prince Chocolate 19g 12x18 Rs20 (1+1) MD
BP Prince Jumbo 41.0g 6x18 Rs40 MD
BP Prince Coco Choc 24g 6x24 Rs30 MD
TP Prince Enrobed 20g 12x18 Rs. 30 MD
VP Zeera Plus 70.2g 6x18 Rs.50[CPTapal] MD
SP Zeera Plus 54g 8x18 Rs40 [CPTapalRs20 MD
SP BakeriNankhatai 44.8g8x18Rs40 CPTapal10 MD
VP Zeera Plus 70.2g 6x18 Rs.50 MD
SP Zeera Plus 54g 8x18 Rs 40 MD
HR Zeera Plus 32.4g 10x18 Rs.30 MD
BP Zeera Plus 21.6g 12x18 Rs.20 MD
TP Candi Original 11.6g 24x18 Rs.10 MD
TP Zeera Plus 10.8g 24x18 Rs.10 MD
SP Milco LU Double Milk45g8x18Rs40 CP+2BP
BP Milco LU DoubleMilk 22.5g16x18Rs20[CP+2
SP Milco LU Double Milk45g8x18Rs40 CP+2BP MD
BP Milco LU DoubleMilk 22.5g16x18Rs20 CP+2 MD
VP Oreo Original 57g 6x18 Rs50
SP Oreo Original 38.0g 8x18 Rs40
BP Oreo Original 19g 16x18 Rs20
VP Oreo Original 57g 6x18 Rs50 MD
SP Oreo Original 38.0g 8x18 Rs40 MD
BP Oreo Original 19g 16x18 Rs20 MD
SP Oreo Original 38g 8x18 8SP+1 SP CP
BP Oreo Original 19g 16x18 16BP+2BP-CP
SP Oreo Original 38g 8x18 8SP+1 SP CP MD
BP Oreo Original 19g 16x18 16BP+2BP-CP MD
VP Gala Egg 66.3g 8x18 Rs.40
SP Gala Egg 51.0g 10x18 Rs.30
HR Gala Egg 30.6g 12x18 Rs 20
HR Gala Egg 30.6g 1x24 Rs 20 CP+1HR
BP Gala Egg 15.3g 24x18 Rs 10
BP Gala Egg 15.3g 1x73 Rs 10 CP 2BP
VP Gala Egg 66.3g 8x18 Rs.40 MD
SP Gala Egg 51.0g 10x18 Rs.30 MD
HR Gala Egg 30.6g 12x18 Rs 20 MD
HR Gala Egg 30.6g 1x24 Rs 20 [CP+1HR] MD
BP Gala Egg 15.3g 24x18 Rs 10 MD
BP Gala Egg 15.3g 1x73 Rs 10 CP 2BP MD
SP Zeera Plus 59.4g8x18 Rs40 2Oreo Cr CP
SP Zeera Plus 59.4g8x18 Rs40 2Oreo Cr CP MD
BP Mini Oreo Original 10g 24x18Rs10 CP+2
BP Mini Oreo Chocolate 10g24x18Rs10 CP+2
BP Mini Oreo Original 10g 24x18Rs10 CP+2 MD
BP Mini Oreo Chocolate 10g24x18Rs10 CP+2 MD
BP Prince Coco Choc 20g 8x24 Rs30
BP Cadbury Mini Fingers 13.4g 12x18 Rs20
VP OREO CHOCOLATE 57g 6x18 Rs 50
SP Candi 58.0g 8x18Rs40 CP MiniFingRs20
SP Oreo Original 38.0g 8x18 1BPCP Rs 40
BP Oreo Original 19g 16x18 1BPCP Rs.20
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20
VP Gala Egg 66.3g 8x18 Rs.40 1HR CP
SP Prince Chocolate 57g 6x24 2BP CP Rs50
SP Gala Egg 51g 10x18 1HR Free CP Rs.30
BP Gala Egg 15.3g 24x18 Rs 10 1BP CP
TP Prince Junior 12g 24x18 2TPCP
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20
VP Oreo Original 57g 6x18 1BP
BP Zeera Plus 32.4g 12x18 Rs.20
FP Gala Egg 100g 1x96 Rs 90
VP Gala Egg 65g 8x18 Rs.40
SP Gala Egg 50.0g 10x18 Rs.30
HR Gala Egg 30.0g 12x18 Rs 20
HR Gala Egg 30.0g 1x25 Rs 20 24HR+1HR CP
BP Gala Egg 15.0g 24x18 Rs 10
BP Gala Egg 15.0g 1x73 Rs 10 [CP+2BP]
BP Gala Egg 20.0g 1x73 Rs10[CP+2BP]4bisc
VP Gala Egg 65.0g 8x18 Rs.40 1HR CP
Gala Egg BP 15.0g 24x18 Rs 101BP CP
SP Candi Original 58.0g 9x18 1CP Rs.40
SP Prince Chocol 57g 6 1x24 1BP CP Rs50
FP TUC 80.96g 1x96 Rs 90 (22 bisctuits)
SP TUC 44.16g 8x18 Rs40 (12biscuits)
HR TUC 33.12g 8x18 Rs.30 (9biscuits)
BP TUC 22.08g 15x18 Rs.20 (6biscuits)
TP TUC 11.04g 30x18 Rs.10 (3 biscuits)
SP Milco LU Double Milk 45g 6x18 Rs40
BP Milco LU DoubleMilk 22.5g 12x18 Rs20
SP Milco LU Double Milk 45g 6x18 Rs40 MD
BP Milco LU DoubleMilk 22.5g 12x18 Rs20 MD
SP TUC 44.16g 8x18 Rs40 CP Tang
SP Candi Orig 63.8g 8x18 Rs.40 (11Bisc)
SP Zeera Plus 59.4g 8x18 Rs 40 (11 Bics)
TP Candi Orig 17.4g 24x18 Rs.10 (3 bisc)
SP Milco LU Double Milk 48.6g 6x18 Rs40
BP Milco LU DoubleMilk 24.3g 12x18 Rs20
VP Gala Egg 65g 8x18 Rs.40 1VP CP
SP Candi Original 63.8g 9x18 1CP Rs.40
T/P TUC TP 16g 24x24
BP TUC BP 32g 12x24
S/P Candi Original SP 66g 6x24
S/P Gala Egg SP 62.4g 6x24 (NP 11-13)
T/P Candi Original TP 18g 24x24
T/P Gala Egg TP 15.6g 24x24
MHR Candi Original MHR 36g 12x24
S/P Wheatable Sugar Free SP 57g 1x96
S/P Prince Chocolate SP 57g 6x24
T/P Prince Chocolate TP 19g 24x24
B/P Tiger BP 22.5g 24x24
S/P TUC SP 48g 6x24 (NP0814)
T/P Bakeri Nankhatai TP 14g 24x24
B/P Bakeri Nankhatai BP 28g 12x24
S/P Bakeri Nankhatai SP 49g 6x24
BP Gala Egg BP 31.2g 12x24
S/P Bakeri Bistiks SP 51.2g 6x24 [ND]
B/P Bakeri Bistiks BP 32g 12x24 [ND]
S/P Bakeri Butter SP 48g 6x24 [ND]
B/P Bakeri Butter BP 24g 12x24 [ND]
S/P Bakeri Classic SP 56.7g 6x24 [ND]
S/P Bakeri Coconut SP 48g 6x24 [ND]
T/P Bakeri Coconut TP 12g 24x24 [ND]
B/P Prince Chocolate BP 38g 12x24
S/P Zeera Plus SP 71.5g 6x24 [ND]
T/P Zeera Plus TP 16.5g 24x24 [ND]
MHR Zeera Plus MHR 33g 12x24 [ND]
F/P Candi Original FP 108g 1x96 NP116
F/P Gala Egg FP 114.4g 1x96 NP116
F/P TUC FP 84g 1x96 NP116
F/P Prince Chocolate FP 95g 1x96 NP116
F/P Wheatable Sugar Free FP114g 1x48 NP116
F/P Bakeri Nankhatai FP 84g 1x96 NP116
F/P Bakeri Bistiks FP 89.6g 1x96 [ND] NP116
F/P Bakeri Butter FP 84g 1x96 [ND] NP116
F/P Bakeri Classic FP 107.1g 1x96 [ND] NP116
T/P Bakeri Classic TP 18.9g 24x24 [ND] NP116
F/P Bakeri Coconut FP 84g 1x96 [ND] NP116
F/P Zeera Plus FP 126.5g 1x96 [ND] NP116
T/P Bakeri Butter TP 12g 24x24
F/P Wheatable HighFiber FP129.6g 1x48 [ND]
S/P Wheatable High Fiber SP 64.8g 1x96 [ND]
T/P Oreo Original TP 19.6g 24x24 [ND]
B/P Oreo Orignal BP29.4g 12x24(300GSM w/o UV
S/P Prince Chocolate SP 57g 6x24 Auto [ND]
S/P Oreo Orignal SP58.8g 6x24(300GSM w/o UV)
F/P Oreo Orignal FP117.6g 1x96(300GSM w/o UV
MHR Zeera Plus MHR 33g 13x24 [CP]
S/P Oreo Original SP 58.8g 6x24 [Storeo LEP]
B/P Oreo Original BP29.4g 12x24 [Storeo LEP]
T/P Oreo Original TP19.6g 24x24 [Storeo LEP]
S/P TUC SP 48g 6x24 [CP Young?s]
S/P Zeera Plus SP 71.5g 6x24 [CP Vital]
B/P Tiger BP 22.5g 24x24 [ND]
B/P Tiger BP 22.5g 25x24 [CP]
SP Prince Chocolate 49.2g 6x24 Rs30[8.2g - LMT
SP Prince Choc 57g6x24 6SP+1TucBiteRs20cpOOH
SP Prince Mini Fingers 19.2g6x24 Rs20 OldPM OOH
BP Prince Coco Choc 19g 6x24 Rs20
BP Prince Coco Choc 19g 6x24 Rs20 MD
BP Prince Coco Choc 19g 6x24 Rs20 LMT
BP Prince Coco Choc 19g 6x24 Rs20 OOH
BP Milco LU 22.5g 16x18 Rs.20 LMT
BP Milco LU 22.5g 16x18 Rs.20 OOH
BP Prince Coco Choc 24g 6x24 Rs30
BP Prince Coco Choc 24g 6x24 Rs30 MD
SP Prince Chocolate 57g 6x24 Rs50 LMT
SP Prince Chocolate 57g 6x24 Rs50 (CAMA) LMT
HR Prince Chocolate 38.0g 6x18 Rs.40 LMT
BP Prince Chocolate 19g 12x18 Rs20 (1+1) LMT
BP Prince Jumbo 41.0g 6x18 Rs40 LMT
BP Prince Coco Choc 24g 6x24 Rs30 LMT
TP Prince Enrobed 20g 12x18 Rs. 30 LMT
VP Zeera Plus 70.2g 6x18 Rs.50[CPTapal] LMT
SP Zeera Plus 54g 8x18 Rs40 [CPTapalRs20 LMT
SP BakeriNankhatai 44.8g8x18Rs40 CPTapal10 LMT
VP Zeera Plus 70.2g 6x18 Rs.50 LMT
SP Zeera Plus 54g 8x18 Rs 40 LMT
HR Zeera Plus 32.4g 10x18 Rs.30 LMT
BP Zeera Plus 21.6g 12x18 Rs.20 LMT
TP Candi Original 11.6g 24x18 Rs.10 LMT
TP Zeera Plus 10.8g 24x18 Rs.10 LMT
SP Prince Chocolate 57g 6x24 Rs50 OOH
SP Prince Chocolate 57g 6x24 Rs50 (CAMA) OOH
HR Prince Chocolate 38.0g 6x18 Rs.40 OOH
BP Prince Chocolate 19g 12x18 Rs20 (1+1) OOH
BP Prince Jumbo 41.0g 6x18 Rs40 OOH
BP Prince Coco Choc 24g 6x24 Rs30 OOH
TP Prince Enrobed 20g 12x18 Rs. 30 OOH
VP Zeera Plus 70.2g 6x18 Rs.50[CPTapal] OOH
SP Zeera Plus 54g 8x18 Rs40 [CPTapalRs20 OOH
SP BakeriNankhatai 44.8g8x18Rs40 CPTapal10 OOH
VP Zeera Plus 70.2g 6x18 Rs.50 OOH
SP Zeera Plus 54g 8x18 Rs 40 OOH
HR Zeera Plus 32.4g 10x18 Rs.30 OOH
BP Zeera Plus 21.6g 12x18 Rs.20 OOH
TP Candi Original 11.6g 24x18 Rs.10 OOH
TP Zeera Plus 10.8g 24x18 Rs.10 OOH
SP Prince Chocolate 57g 6x24 Rs50 ECOM
SP Prince Chocolate 57g 6x24 Rs50 (CAMA) ECOM
HR Prince Chocolate 38.0g 6x18 Rs.40 ECOM
BP Prince Chocolate 19g 12x18 Rs20 (1+1) ECOM
BP Prince Jumbo 41.0g 6x18 Rs40 ECOM
BP Prince Coco Choc 24g 6x24 Rs30 ECOM
TP Prince Enrobed 20g 12x18 Rs. 30 ECOM
VP Zeera Plus 70.2g 6x18 Rs.50[CPTapal] ECOM
SP Zeera Plus 54g 8x18 Rs40 [CPTapalRs20 ECOM
SP BakeriNankhatai 44.8g8x18Rs40 CPTapal10 ECOM
VP Zeera Plus 70.2g 6x18 Rs.50 ECOM
SP Zeera Plus 54g 8x18 Rs 40 ECOM
HR Zeera Plus 32.4g 10x18 Rs.30 ECOM
BP Zeera Plus 21.6g 12x18 Rs.20 ECOM
TP Candi Original 11.6g 24x18 Rs.10 ECOM
TP Zeera Plus 10.8g 24x18 Rs.10 ECOM
SP Milco LU Double Milk45g8x18Rs40 CP+2BP LMT
BP Milco LU DoubleMilk 22.5g16x18Rs20 CP+2 LMT
SP Milco LU Double Milk45g8x18Rs40 CP+2BP OOH
BP Milco LU DoubleMilk 22.5g16x18Rs20 CP+2 OOH
SP Milco LU Double Milk45g8x18Rs40 CP+2BP Ecom
BP Milco LU DoubleMilk 22.5g16x18Rs20 CP+2 Ecom
VP Oreo Original 57g 6x18 Rs50 LMT
SP Oreo Original 38.0g 8x18 Rs40 LMT
BP Oreo Original 19g 16x18 Rs20 LMT
VP Oreo Original 57g 6x18 Rs50 OOH
SP Oreo Original 38.0g 8x18 Rs40 OOH
BP Oreo Original 19g 16x18 Rs20 OOH
VP Oreo Original 57g 6x18 Rs50 ECOM
SP Oreo Original 38.0g 8x18 Rs40 ECOM
BP Oreo Original 19g 16x18 Rs20 ECOM
SP Oreo Original 38g 8x18 8SP+1 SP CP LMT
BP Oreo Original 19g 16x18 16BP+2BP-CP LMT
SP Oreo Original 38g 8x18 8SP+1 SP CP OOH
BP Oreo Original 19g 16x18 16BP+2BP-CP OOH
SP Oreo Original 38g 8x18 8SP+1 SP CP ECOM
BP Oreo Original 19g 16x18 16BP+2BP-CP ECOM
VP Gala Egg 66.3g 8x18 Rs.40 LMT
SP Gala Egg 51.0g 10x18 Rs.30 LMT
HR Gala Egg 30.6g 12x18 Rs 20 LMT
HR Gala Egg 30.6g 1x24 Rs 20 CP+1HR LMT
BP Gala Egg 15.3g 24x18 Rs 10 LMT
BP Gala Egg 15.3g 1x73 Rs 10 CP 2BP LMT
VP Gala Egg 66.3g 8x18 Rs.40 OOH
SP Gala Egg 51.0g 10x18 Rs.30 OOH
HR Gala Egg 30.6g 12x18 Rs 20 OOH
HR Gala Egg 30.6g 1x24 Rs 20 [CP+1HR] OOH
BP Gala Egg 15.3g 24x18 Rs 10 OOH
BP Gala Egg 15.3g 1x73 Rs 10 CP 2BP OOH
VP Gala Egg 66.3g 8x18 Rs.40 ECOM
SP Gala Egg 51.0g 10x18 Rs.30 ECOM
HR Gala Egg 30.6g 12x18 Rs 20 ECOM
HR Gala Egg 30.6g 1x24 Rs 20 [CP+1HR] ECOM
BP Gala Egg 15.3g 24x18 Rs 10 ECOM
BP Gala Egg 15.3g 1x73 Rs 10 CP 2BP ECOM
SP Zeera Plus 59.4g8x18 Rs40 2Oreo Cr CP LMT
SP Zeera Plus 59.4g8x18 Rs40 2Oreo Cr CP OOH
SP Zeera Plus 59.4g8x18 Rs40 2Oreo Cr CP ECOM
BP Mini Oreo Original 10g 24x18Rs10 CP+2 LMT
BP Mini Oreo Chocolate 10g24x18Rs10 CP+2 LMT
BP Mini Oreo Original 10g 24x18Rs10 CP+2 OOH
BP Mini Oreo Chocolate 10g24x18Rs10 CP+2 OOH
BP Mini Oreo Original 10g 24x18Rs10 CP+2 ECOM
BP Mini Oreo Chocolate 10g24x18Rs10 CP+2 ECOM
BP Prince Coco Choc 20g 8x24 Rs30 MD
BP Prince Coco Choc 20g 8x24 Rs30 LMT
BP Prince Coco Choc 20g 8x24 Rs30 OOH
BP Prince Coco Choc 20g 8x24 Rs30 ECOM
BP Cadbury Mini Fingers 13.4g 12x18 Rs20 MD
BP Cadbury Mini Fingers 13.4g 12x18 Rs20 LMT
BP Cadbury Mini Fingers 13.4g 12x18 Rs20 OOH
BP Cadbury Mini Fingers 13.4g 12x18 Rs20 ECOM
VP OREO CHOCOLATE 57g 6x18 Rs 50 MD
VP OREO CHOCOLATE 57g 6x18 Rs 50 LMT
VP OREO CHOCOLATE 57g 6x18 Rs 50 OOH
VP OREO CHOCOLATE 57g 6x18 Rs 50 ECOM
SP Candi 58.0g 8x18Rs40 CP MiniFingRs20 MD
SP Candi 58.0g 8x18Rs40 CP MiniFingRs20 LMT
SP Candi 58.0g 8x18Rs40 CP MiniFingRs20 OOH
SP Candi 58.0g 8x18Rs40 CP MiniFingRs20 ECOM
SP Oreo Original 38.0g 8x18 1BPCP Rs 40 MD
BP Oreo Original 19g 16x18 1BPCP Rs.20 MD
SP Oreo Original 38.0g 8x18 1BPCP Rs 40 LMT
BP Oreo Original 19g 16x18 1BPCP Rs.20 LMT
SP Oreo Original 38.0g 8x18 1BPCP Rs 40 OOH
BP Oreo Original 19g 16x18 1BPCP Rs.20 OOH
SP Oreo Original 38.0g 8x18 1BPCP Rs 40 ECOM
BP Oreo Original 19g 16x18 1BPCP Rs.20 ECOM
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20 MD
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20 LMT
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20 OOH
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20 ECOM
VP Gala Egg 66.3g 8x18 Rs.40 1HR CP MD
SP Prince Chocolate 57g 6x24 2BP CP Rs50 MD
SP Gala Egg 51g 10x18 1HR Free CP Rs.30 MD
BP Gala Egg 15.3g 24x18 Rs 10 1BP CP MD
TP Prince Junior 12g 24x18 2TPCP MD
SP Zeera Plus 54g 8x18 Rs40 CPTapalRs20 MD
VP Oreo Original 57g 6x18 1BP MD
BP Zeera Plus 32.4g 12x18 Rs.20 MD
FP Gala Egg 100g 1x96 Rs 90 MD
VP Gala Egg 65g 8x18 Rs.40 MD
SP Gala Egg 50.0g 10x18 Rs.30 MD
HR Gala Egg 30.0g 12x18 Rs 20 MD
HR Gala Egg 30.0g 1x25 Rs 20 24HR+1HR CP MD
BP Gala Egg 15.0g 24x18 Rs 10 MD
BP Gala Egg 15.0g 1x73 Rs 10 [CP+2BP] MD
BP Gala Egg 20.0g 1x73 Rs10[CP+2BP]4bisc MD
VP Gala Egg 65.0g 8x18 Rs.40 1HR CP MD
Gala Egg BP 15.0g 24x18 Rs 101BP CP MD
SP Candi Original 58.0g 9x18 1CP Rs.40 MD
SP Prince Chocol 57g 6 1x24 1BP CP Rs50 MD
FP TUC 80.96g 1x96 Rs 90 (22 bisctuits) MD
SP TUC 44.16g 8x18 Rs40 (12biscuits) MD
HR TUC 33.12g 8x18 Rs.30 (9biscuits) MD
BP TUC 22.08g 15x18 Rs.20 (6biscuits) MD
TP TUC 11.04g 30x18 Rs.10 (3 biscuits) MD
SP TUC 44.16g 8x18 Rs40 CP Tang MD
SP Candi Orig 63.8g 8x18 Rs.40 (11Bisc) MD
SP Zeera Plus 59.4g 8x18 Rs 40 (11 Bics) MD
TP Candi Orig 17.4g 24x18 Rs.10 (3 bisc) MD
SP Milco LU Double Milk 48.6g 6x18 Rs40 MD
BP Milco LU DoubleMilk 24.3g 12x18 Rs20 MD
VP Gala Egg 65g 8x18 Rs.40 1VP CP MD
SP Candi Original 63.8g 9x18 1CP Rs.40 MD
VP Bakeri Khaas 65.38g 6x18 Rs.40 (14bis MD
HR Bakeri Khaas 56.04g 8x18 Rs.30 12 bis MD
BP Bakeri Khaas 37.36g 12x18 Rs.20 8 bis MD
TP Bakeri Khaas 18.68g 24x18 Rs.10 4 bis MD
SP Milco LU DM 48.6g 6x18 1BP CP Rs40 MD

`
  // Function to extract structured data
// Extract the number immediately before the first 'x' in the string
  const extractNumberBeforeX = (str) => {
    const regex = /(\d+)\s*x/i;  // capture digits before 'x' (case insensitive)
    const match = str.match(regex);
    if (match) {
      return match[1];  // first capture group = number before 'x'
    }
    return null;
  };

  const extractData = (text) => {
    const lines = text.trim().split('\n');
    return lines.map(line => ({
      product: line.trim(),
      number_before_x: extractNumberBeforeX(line),
    }));
  };

  const handleExport = () => {
    const extractedData = extractData(rawText);
    const worksheet = XLSX.utils.json_to_sheet(extractedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "ProductData.xlsx");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Export Product Info to Excel</h2>
      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export to Excel
      </button>
    </div>
  );
};

export default ExcelExport;
