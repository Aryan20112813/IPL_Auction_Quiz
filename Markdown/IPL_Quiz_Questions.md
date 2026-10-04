# IPL Quiz Questions — Master Question Bank

Master question bank for **Quiz for IPL Auction**. Every quiz randomly selects **25** of these **100** questions (see `Workflow.md` §6).

## Summary

| Metric | Count |
|---|---|
| Total questions | 100 |
| Easy | 30 |
| Medium | 40 |
| Hard | 30 |
| Options per question | 4 (A, B, C, D) |
| Correct answers per question | Exactly 1 |
| Correct-answer distribution | A = 25, B = 25, C = 25, D = 25 |

### Notes for maintainers

- **Cut-off:** facts are verified through the **IPL 2025** season. Questions about records or career totals state "through the 2025 season" where they could change. Add new questions with an explicit season when later seasons are played.
- **Team names:** franchises are named as they were at the time of the event (e.g., *Royal Challengers Bangalore* before 2024, *Royal Challengers Bengaluru* from 2024; *Delhi Daredevils* before 2019).
- **Parsing contract:** each question starts with `## Q<number>.`, has options `**A.**`–`**D.**`, then `**Answer:**` and `**Difficulty:**`. `scripts/parse-questions.ts` converts this file into `questions.json` and assigns stable IDs `Q001`–`Q100`. Do not change this layout without updating the parser.
- **Security:** this file contains the answer key. It lives in the repository (`data/questions/`) and the seed script; it must never be served as a public static asset.

---

## Q1. In which year was the first season of the IPL played?

**A.** 2005  
**B.** 2007  
**C.** 2010  
**D.** 2008  

**Answer:** D  
**Difficulty:** Easy

## Q2. Which franchise won the inaugural IPL season in 2008?

**A.** Rajasthan Royals  
**B.** Mumbai Indians  
**C.** Chennai Super Kings  
**D.** Deccan Chargers  

**Answer:** A  
**Difficulty:** Easy

## Q3. How many overs does each team get to bat in a standard IPL match?

**A.** 25  
**B.** 15  
**C.** 10  
**D.** 20  

**Answer:** D  
**Difficulty:** Easy

## Q4. Which coloured cap is awarded to the leading run-scorer of an IPL season?

**A.** Green Cap  
**B.** Orange Cap  
**C.** Blue Cap  
**D.** Purple Cap  

**Answer:** B  
**Difficulty:** Easy

## Q5. Which coloured cap is awarded to the leading wicket-taker of an IPL season?

**A.** Purple Cap  
**B.** Red Cap  
**C.** Yellow Cap  
**D.** Orange Cap  

**Answer:** A  
**Difficulty:** Easy

## Q6. Which cricket board organises the IPL?

**A.** Cricket Australia  
**B.** BCCI  
**C.** ICC  
**D.** ECB  

**Answer:** B  
**Difficulty:** Easy

## Q7. What is the maximum number of overs a single bowler can bowl in an IPL innings?

**A.** 4  
**B.** 6  
**C.** 3  
**D.** 5  

**Answer:** A  
**Difficulty:** Easy

## Q8. How many overs does the Powerplay last in an IPL innings?

**A.** 8  
**B.** 4  
**C.** 6  
**D.** 10  

**Answer:** C  
**Difficulty:** Easy

## Q9. What is used to decide an IPL match if the scores are tied after 20 overs each?

**A.** Coin toss  
**B.** Super Over  
**C.** Boundary count  
**D.** Replay on the next day  

**Answer:** B  
**Difficulty:** Easy

## Q10. How many franchises have competed in each IPL season from 2022 onward?

**A.** 12  
**B.** 10  
**C.** 8  
**D.** 9  

**Answer:** B  
**Difficulty:** Easy

## Q11. Which two new franchises joined the IPL in 2022?

**A.** Pune Warriors India and Kochi Tuskers Kerala  
**B.** Deccan Chargers and Sunrisers Hyderabad  
**C.** Rising Pune Supergiant and Gujarat Lions  
**D.** Gujarat Titans and Lucknow Super Giants  

**Answer:** D  
**Difficulty:** Easy

## Q12. Which franchise won the IPL title in its debut season in 2022?

**A.** Punjab Kings  
**B.** Gujarat Titans  
**C.** Rajasthan Royals  
**D.** Lucknow Super Giants  

**Answer:** B  
**Difficulty:** Easy

## Q13. Who captained Gujarat Titans to the 2022 IPL title?

**A.** David Miller  
**B.** Hardik Pandya  
**C.** Shubman Gill  
**D.** Rashid Khan  

**Answer:** B  
**Difficulty:** Easy

## Q14. Which franchise won the IPL 2025 title?

**A.** Mumbai Indians  
**B.** Gujarat Titans  
**C.** Royal Challengers Bengaluru  
**D.** Punjab Kings  

**Answer:** C  
**Difficulty:** Easy

## Q15. Which franchise won the IPL 2024 title?

**A.** Sunrisers Hyderabad  
**B.** Royal Challengers Bengaluru  
**C.** Kolkata Knight Riders  
**D.** Rajasthan Royals  

**Answer:** C  
**Difficulty:** Easy

## Q16. Who captained Kolkata Knight Riders to the IPL 2024 title?

**A.** Shreyas Iyer  
**B.** Nitish Rana  
**C.** Andre Russell  
**D.** Rinku Singh  

**Answer:** A  
**Difficulty:** Easy

## Q17. Which wicketkeeper-batter captained Chennai Super Kings to the titles of 2010, 2011, 2018, 2021 and 2023?

**A.** Ravindra Jadeja  
**B.** Ruturaj Gaikwad  
**C.** Suresh Raina  
**D.** MS Dhoni  

**Answer:** D  
**Difficulty:** Easy

## Q18. Which captain led Mumbai Indians to five IPL titles?

**A.** Ricky Ponting  
**B.** Hardik Pandya  
**C.** Rohit Sharma  
**D.** MS Dhoni  

**Answer:** C  
**Difficulty:** Easy

## Q19. Through the 2025 season, which two franchises have won five IPL titles each?

**A.** Chennai Super Kings and Kolkata Knight Riders  
**B.** Royal Challengers Bengaluru and Mumbai Indians  
**C.** Mumbai Indians and Chennai Super Kings  
**D.** Mumbai Indians and Kolkata Knight Riders  

**Answer:** C  
**Difficulty:** Easy

## Q20. Which batter scored a record 973 runs in a single IPL season in 2016?

**A.** David Warner  
**B.** Jos Buttler  
**C.** Virat Kohli  
**D.** Shubman Gill  

**Answer:** C  
**Difficulty:** Easy

## Q21. Which batter is nicknamed the 'Universe Boss'?

**A.** Chris Gayle  
**B.** AB de Villiers  
**C.** Andre Russell  
**D.** Kieron Pollard  

**Answer:** A  
**Difficulty:** Easy

## Q22. Eden Gardens is the home ground of which IPL franchise?

**A.** Kolkata Knight Riders  
**B.** Sunrisers Hyderabad  
**C.** Rajasthan Royals  
**D.** Delhi Capitals  

**Answer:** A  
**Difficulty:** Easy

## Q23. Wankhede Stadium is the home ground of which IPL franchise?

**A.** Chennai Super Kings  
**B.** Punjab Kings  
**C.** Royal Challengers Bengaluru  
**D.** Mumbai Indians  

**Answer:** D  
**Difficulty:** Easy

## Q24. MA Chidambaram Stadium (Chepauk) is the home ground of which IPL franchise?

**A.** Chennai Super Kings  
**B.** Mumbai Indians  
**C.** Kolkata Knight Riders  
**D.** Sunrisers Hyderabad  

**Answer:** A  
**Difficulty:** Easy

## Q25. M. Chinnaswamy Stadium is the home ground of which IPL franchise?

**A.** Royal Challengers Bengaluru  
**B.** Delhi Capitals  
**C.** Lucknow Super Giants  
**D.** Rajasthan Royals  

**Answer:** A  
**Difficulty:** Easy

## Q26. Narendra Modi Stadium in Ahmedabad has been the home ground of which franchise since 2022?

**A.** Mumbai Indians  
**B.** Gujarat Titans  
**C.** Rajasthan Royals  
**D.** Kolkata Knight Riders  

**Answer:** B  
**Difficulty:** Easy

## Q27. Which actor is a co-owner of Kolkata Knight Riders?

**A.** Salman Khan  
**B.** Aamir Khan  
**C.** Akshay Kumar  
**D.** Shah Rukh Khan  

**Answer:** D  
**Difficulty:** Easy

## Q28. Which actress is a co-owner of Punjab Kings?

**A.** Preity Zinta  
**B.** Juhi Chawla  
**C.** Shilpa Shetty  
**D.** Deepika Padukone  

**Answer:** A  
**Difficulty:** Easy

## Q29. Jasprit Bumrah has played his entire IPL career for which franchise?

**A.** Mumbai Indians  
**B.** Chennai Super Kings  
**C.** Gujarat Titans  
**D.** Kolkata Knight Riders  

**Answer:** A  
**Difficulty:** Easy

## Q30. Who captained Rajasthan Royals to the inaugural IPL title in 2008?

**A.** Sanju Samson  
**B.** Rahul Dravid  
**C.** Shane Warne  
**D.** Shane Watson  

**Answer:** C  
**Difficulty:** Easy

## Q31. Which country hosted the entire IPL 2009 season?

**A.** United Arab Emirates  
**B.** England  
**C.** Sri Lanka  
**D.** South Africa  

**Answer:** D  
**Difficulty:** Medium

## Q32. In which country were all matches of IPL 2020 played?

**A.** United Arab Emirates  
**B.** Qatar  
**C.** India  
**D.** South Africa  

**Answer:** A  
**Difficulty:** Medium

## Q33. Which franchise, captained by Adam Gilchrist, won the IPL 2009 title?

**A.** Royal Challengers Bangalore  
**B.** Chennai Super Kings  
**C.** Deccan Chargers  
**D.** Kolkata Knight Riders  

**Answer:** C  
**Difficulty:** Medium

## Q34. Which franchise replaced Deccan Chargers in the IPL from the 2013 season?

**A.** Gujarat Lions  
**B.** Pune Warriors India  
**C.** Kochi Tuskers Kerala  
**D.** Sunrisers Hyderabad  

**Answer:** D  
**Difficulty:** Medium

## Q35. Which team did Sunrisers Hyderabad beat in the IPL 2016 final?

**A.** Royal Challengers Bangalore  
**B.** Mumbai Indians  
**C.** Gujarat Lions  
**D.** Kolkata Knight Riders  

**Answer:** A  
**Difficulty:** Medium

## Q36. Who captained Sunrisers Hyderabad to their IPL 2016 title?

**A.** Bhuvneshwar Kumar  
**B.** Kane Williamson  
**C.** David Warner  
**D.** Shikhar Dhawan  

**Answer:** C  
**Difficulty:** Medium

## Q37. Which two franchises were suspended from the IPL for the 2016 and 2017 seasons?

**A.** Chennai Super Kings and Rajasthan Royals  
**B.** Mumbai Indians and Kolkata Knight Riders  
**C.** Royal Challengers Bangalore and Delhi Daredevils  
**D.** Kings XI Punjab and Sunrisers Hyderabad  

**Answer:** A  
**Difficulty:** Medium

## Q38. Which franchise won back-to-back IPL titles in 2010 and 2011?

**A.** Kolkata Knight Riders  
**B.** Rajasthan Royals  
**C.** Chennai Super Kings  
**D.** Mumbai Indians  

**Answer:** C  
**Difficulty:** Medium

## Q39. In the IPL 2019 final, Mumbai Indians beat which team by one run?

**A.** Chennai Super Kings  
**B.** Sunrisers Hyderabad  
**C.** Delhi Capitals  
**D.** Kolkata Knight Riders  

**Answer:** A  
**Difficulty:** Medium

## Q40. Which CSK all-rounder hit a six and a four off the last two balls to win the IPL 2023 final against Gujarat Titans?

**A.** Shivam Dube  
**B.** Ambati Rayudu  
**C.** MS Dhoni  
**D.** Ravindra Jadeja  

**Answer:** D  
**Difficulty:** Medium

## Q41. Which team did Chennai Super Kings beat in the IPL 2021 final in Dubai?

**A.** Royal Challengers Bangalore  
**B.** Kolkata Knight Riders  
**C.** Mumbai Indians  
**D.** Delhi Capitals  

**Answer:** B  
**Difficulty:** Medium

## Q42. Who won the Orange Cap in IPL 2023 with 890 runs?

**A.** Yashasvi Jaiswal  
**B.** Virat Kohli  
**C.** Faf du Plessis  
**D.** Shubman Gill  

**Answer:** D  
**Difficulty:** Medium

## Q43. Who won the Orange Cap in IPL 2022 with 863 runs?

**A.** Jos Buttler  
**B.** KL Rahul  
**C.** Quinton de Kock  
**D.** Hardik Pandya  

**Answer:** A  
**Difficulty:** Medium

## Q44. Who won the Orange Cap in IPL 2025?

**A.** Virat Kohli  
**B.** Shubman Gill  
**C.** Suryakumar Yadav  
**D.** Sai Sudharsan  

**Answer:** D  
**Difficulty:** Medium

## Q45. Who won the Orange Cap in IPL 2020 with 670 runs?

**A.** David Warner  
**B.** KL Rahul  
**C.** Shikhar Dhawan  
**D.** Ishan Kishan  

**Answer:** B  
**Difficulty:** Medium

## Q46. Who won the Purple Cap in IPL 2023 with 28 wickets?

**A.** Rashid Khan  
**B.** Piyush Chawla  
**C.** Mohammed Shami  
**D.** Mohit Sharma  

**Answer:** C  
**Difficulty:** Medium

## Q47. Who won the Purple Cap in IPL 2022 with 27 wickets?

**A.** Yuzvendra Chahal  
**B.** Kagiso Rabada  
**C.** T Natarajan  
**D.** Wanindu Hasaranga  

**Answer:** A  
**Difficulty:** Medium

## Q48. Who won the Purple Cap in IPL 2021 with 32 wickets?

**A.** Rashid Khan  
**B.** Harshal Patel  
**C.** Jasprit Bumrah  
**D.** Avesh Khan  

**Answer:** B  
**Difficulty:** Medium

## Q49. Who won the Purple Cap in IPL 2020 with 30 wickets?

**A.** Trent Boult  
**B.** Jasprit Bumrah  
**C.** Anrich Nortje  
**D.** Kagiso Rabada  

**Answer:** D  
**Difficulty:** Medium

## Q50. Through the 2025 season, who has scored the most runs in IPL history?

**A.** Shikhar Dhawan  
**B.** David Warner  
**C.** Virat Kohli  
**D.** Rohit Sharma  

**Answer:** C  
**Difficulty:** Medium

## Q51. Through the 2025 season, who has taken the most wickets in IPL history?

**A.** Dwayne Bravo  
**B.** Piyush Chawla  
**C.** Bhuvneshwar Kumar  
**D.** Yuzvendra Chahal  

**Answer:** D  
**Difficulty:** Medium

## Q52. Which team scored the highest total in IPL history, 287/3 against Royal Challengers Bengaluru in 2024?

**A.** Chennai Super Kings  
**B.** Sunrisers Hyderabad  
**C.** Kolkata Knight Riders  
**D.** Mumbai Indians  

**Answer:** B  
**Difficulty:** Medium

## Q53. Which team recorded the lowest IPL total of 49 all out, against Kolkata Knight Riders in 2017?

**A.** Royal Challengers Bangalore  
**B.** Rajasthan Royals  
**C.** Delhi Daredevils  
**D.** Kings XI Punjab  

**Answer:** A  
**Difficulty:** Medium

## Q54. Who was the first chairman and commissioner of the IPL?

**A.** Sharad Pawar  
**B.** Rajiv Shukla  
**C.** N. Srinivasan  
**D.** Lalit Modi  

**Answer:** D  
**Difficulty:** Medium

## Q55. Who was the most expensive player at the first IPL auction in 2008, bought for US$1.5 million?

**A.** Ishant Sharma  
**B.** Irfan Pathan  
**C.** MS Dhoni  
**D.** Andrew Symonds  

**Answer:** C  
**Difficulty:** Medium

## Q56. Which company became the IPL title sponsor from the 2022 season?

**A.** Vivo  
**B.** Pepsi  
**C.** Tata Group  
**D.** Dream11  

**Answer:** C  
**Difficulty:** Medium

## Q57. In which season was the Impact Player rule introduced in the IPL?

**A.** 2021  
**B.** 2024  
**C.** 2023  
**D.** 2022  

**Answer:** C  
**Difficulty:** Medium

## Q58. What is the maximum number of overseas players allowed in a team's playing XI in the IPL?

**A.** 6  
**B.** 3  
**C.** 5  
**D.** 4  

**Answer:** D  
**Difficulty:** Medium

## Q59. Delhi Daredevils were renamed Delhi Capitals ahead of which season?

**A.** 2019  
**B.** 2018  
**C.** 2017  
**D.** 2021  

**Answer:** A  
**Difficulty:** Medium

## Q60. In which year did Kings XI Punjab rebrand as Punjab Kings?

**A.** 2020  
**B.** 2022  
**C.** 2021  
**D.** 2019  

**Answer:** C  
**Difficulty:** Medium

## Q61. Which franchise bought Mitchell Starc for Rs 24.75 crore at the IPL 2024 auction?

**A.** Sunrisers Hyderabad  
**B.** Kolkata Knight Riders  
**C.** Mumbai Indians  
**D.** Chennai Super Kings  

**Answer:** B  
**Difficulty:** Medium

## Q62. Which franchise bought Rishabh Pant for a then-record Rs 27 crore at the IPL 2025 mega auction?

**A.** Punjab Kings  
**B.** Lucknow Super Giants  
**C.** Royal Challengers Bengaluru  
**D.** Delhi Capitals  

**Answer:** B  
**Difficulty:** Medium

## Q63. In which city was the IPL 2025 mega auction held?

**A.** Mumbai  
**B.** Jeddah  
**C.** Bengaluru  
**D.** Dubai  

**Answer:** B  
**Difficulty:** Medium

## Q64. Who has been the long-time head coach of Chennai Super Kings?

**A.** Stephen Fleming  
**B.** Ricky Ponting  
**C.** Mahela Jayawardene  
**D.** Tom Moody  

**Answer:** A  
**Difficulty:** Medium

## Q65. Which former Australian captain was Punjab Kings' head coach in IPL 2025?

**A.** Trevor Bayliss  
**B.** Justin Langer  
**C.** Ricky Ponting  
**D.** Tom Moody  

**Answer:** C  
**Difficulty:** Medium

## Q66. Who was Kolkata Knight Riders' mentor during their IPL 2024 title-winning season?

**A.** Brendon McCullum  
**B.** Gautam Gambhir  
**C.** Chandrakant Pandit  
**D.** Dwayne Bravo  

**Answer:** B  
**Difficulty:** Medium

## Q67. Who scored an unbeaten 158 in the very first IPL match in 2008?

**A.** Brendon McCullum  
**B.** Sourav Ganguly  
**C.** Ricky Ponting  
**D.** Virender Sehwag  

**Answer:** A  
**Difficulty:** Medium

## Q68. Rinku Singh hit five consecutive sixes in the final over of a 2023 IPL match against which team?

**A.** Lucknow Super Giants  
**B.** Punjab Kings  
**C.** Gujarat Titans  
**D.** Rajasthan Royals  

**Answer:** C  
**Difficulty:** Medium

## Q69. Who took the first hat-trick in IPL history, for Chennai Super Kings in 2008?

**A.** Harbhajan Singh  
**B.** Muttiah Muralitharan  
**C.** Lakshmipathy Balaji  
**D.** Makhaya Ntini  

**Answer:** C  
**Difficulty:** Medium

## Q70. Who won the Orange Cap in IPL 2010 while playing for Mumbai Indians?

**A.** Suresh Raina  
**B.** Sachin Tendulkar  
**C.** Rohit Sharma  
**D.** Jacques Kallis  

**Answer:** B  
**Difficulty:** Medium

## Q71. Chris Gayle's record unbeaten 175 in 2013 came against which team?

**A.** Delhi Daredevils  
**B.** Pune Warriors India  
**C.** Mumbai Indians  
**D.** Kings XI Punjab  

**Answer:** B  
**Difficulty:** Hard

## Q72. Yashasvi Jaiswal hit the fastest IPL fifty, off 13 balls, in 2023 against which team?

**A.** Mumbai Indians  
**B.** Sunrisers Hyderabad  
**C.** Kolkata Knight Riders  
**D.** Chennai Super Kings  

**Answer:** C  
**Difficulty:** Hard

## Q73. What is the fewest number of balls taken to score an IPL century (record, set in 2013)?

**A.** 28  
**B.** 30  
**C.** 33  
**D.** 38  

**Answer:** B  
**Difficulty:** Hard

## Q74. Which team chased down 262 against Kolkata Knight Riders in 2024, the highest successful chase in IPL history?

**A.** Punjab Kings  
**B.** Rajasthan Royals  
**C.** Sunrisers Hyderabad  
**D.** Delhi Capitals  

**Answer:** A  
**Difficulty:** Hard

## Q75. Virat Kohli and AB de Villiers shared a record 229-run partnership in 2016 against which team?

**A.** Sunrisers Hyderabad  
**B.** Mumbai Indians  
**C.** Kolkata Knight Riders  
**D.** Gujarat Lions  

**Answer:** D  
**Difficulty:** Hard

## Q76. Alzarri Joseph recorded the best bowling figures in IPL history, 6/12 in 2019, against which team?

**A.** Chennai Super Kings  
**B.** Kolkata Knight Riders  
**C.** Sunrisers Hyderabad  
**D.** Delhi Capitals  

**Answer:** C  
**Difficulty:** Hard

## Q77. Which team lost the IPL 2017 final to Mumbai Indians by a single run?

**A.** Rising Pune Supergiant  
**B.** Royal Challengers Bangalore  
**C.** Kolkata Knight Riders  
**D.** Sunrisers Hyderabad  

**Answer:** A  
**Difficulty:** Hard

## Q78. Who scored a century for Chennai Super Kings in the IPL 2018 final against Sunrisers Hyderabad?

**A.** Suresh Raina  
**B.** Shane Watson  
**C.** MS Dhoni  
**D.** Faf du Plessis  

**Answer:** B  
**Difficulty:** Hard

## Q79. Which team was bowled out for just 113 in the IPL 2024 final?

**A.** Sunrisers Hyderabad  
**B.** Rajasthan Royals  
**C.** Royal Challengers Bengaluru  
**D.** Chennai Super Kings  

**Answer:** A  
**Difficulty:** Hard

## Q80. In which city was the IPL 2014 final between Kolkata Knight Riders and Kings XI Punjab played?

**A.** Kolkata  
**B.** Chennai  
**C.** Bengaluru  
**D.** Mumbai  

**Answer:** C  
**Difficulty:** Hard

## Q81. Who was named Player of the Match in the 2008 IPL final between Rajasthan Royals and Chennai Super Kings?

**A.** Graeme Smith  
**B.** Shane Warne  
**C.** Shane Watson  
**D.** Yusuf Pathan  

**Answer:** D  
**Difficulty:** Hard

## Q82. Who won the Orange Cap in the inaugural IPL season in 2008, playing for Kings XI Punjab?

**A.** Shaun Marsh  
**B.** Matthew Hayden  
**C.** Sanath Jayasuriya  
**D.** Gautam Gambhir  

**Answer:** A  
**Difficulty:** Hard

## Q83. Which batter won back-to-back Orange Caps in 2011 and 2012?

**A.** David Warner  
**B.** Michael Hussey  
**C.** Virat Kohli  
**D.** Chris Gayle  

**Answer:** D  
**Difficulty:** Hard

## Q84. Who won the Orange Cap in IPL 2014 with 660 runs for Kolkata Knight Riders?

**A.** Manish Pandey  
**B.** Suresh Raina  
**C.** Robin Uthappa  
**D.** Gautam Gambhir  

**Answer:** C  
**Difficulty:** Hard

## Q85. Who won the Orange Cap in IPL 2018 with 735 runs for Sunrisers Hyderabad?

**A.** Rishabh Pant  
**B.** Ambati Rayudu  
**C.** Kane Williamson  
**D.** KL Rahul  

**Answer:** C  
**Difficulty:** Hard

## Q86. Which batter won the Orange Cap in 2015, 2017 and 2019?

**A.** Virat Kohli  
**B.** Chris Gayle  
**C.** KL Rahul  
**D.** David Warner  

**Answer:** D  
**Difficulty:** Hard

## Q87. Which bowler won the Purple Cap in both 2013 and 2015?

**A.** Lasith Malinga  
**B.** Harbhajan Singh  
**C.** Bhuvneshwar Kumar  
**D.** Dwayne Bravo  

**Answer:** D  
**Difficulty:** Hard

## Q88. Which bowler won back-to-back Purple Caps in 2016 and 2017?

**A.** Rashid Khan  
**B.** Bhuvneshwar Kumar  
**C.** Jasprit Bumrah  
**D.** Yuzvendra Chahal  

**Answer:** B  
**Difficulty:** Hard

## Q89. Which CSK spinner won the Purple Cap in IPL 2019 with 26 wickets?

**A.** Ravindra Jadeja  
**B.** Harbhajan Singh  
**C.** Deepak Chahar  
**D.** Imran Tahir  

**Answer:** D  
**Difficulty:** Hard

## Q90. Which Australian pacer won the Purple Cap in IPL 2018 for Kings XI Punjab?

**A.** Pat Cummins  
**B.** Andrew Tye  
**C.** Josh Hazlewood  
**D.** Mitchell Starc  

**Answer:** B  
**Difficulty:** Hard

## Q91. Who won the Purple Cap in IPL 2011 with 28 wickets for Mumbai Indians?

**A.** Dwayne Bravo  
**B.** Amit Mishra  
**C.** Shane Warne  
**D.** Lasith Malinga  

**Answer:** D  
**Difficulty:** Hard

## Q92. Which Pakistani bowler won the Purple Cap in the inaugural IPL season in 2008?

**A.** Umar Gul  
**B.** Mohammad Asif  
**C.** Shahid Afridi  
**D.** Sohail Tanvir  

**Answer:** D  
**Difficulty:** Hard

## Q93. Through the 2025 season, how many IPL centuries has Virat Kohli scored?

**A.** 9  
**B.** 6  
**C.** 7  
**D.** 8  

**Answer:** D  
**Difficulty:** Hard

## Q94. Which spinner has taken three hat-tricks in the IPL?

**A.** Lasith Malinga  
**B.** Amit Mishra  
**C.** Yuvraj Singh  
**D.** Sunil Narine  

**Answer:** B  
**Difficulty:** Hard

## Q95. In which year did Kochi Tuskers Kerala play their only IPL season?

**A.** 2013  
**B.** 2011  
**C.** 2012  
**D.** 2010  

**Answer:** B  
**Difficulty:** Hard

## Q96. Before winning the title in 2025, how many IPL finals had Royal Challengers Bangalore lost?

**A.** 2  
**B.** 5  
**C.** 3  
**D.** 4  

**Answer:** C  
**Difficulty:** Hard

## Q97. In which city was the IPL 2024 player auction held, the first IPL auction outside India?

**A.** Singapore  
**B.** Jeddah  
**C.** Abu Dhabi  
**D.** Dubai  

**Answer:** D  
**Difficulty:** Hard

## Q98. How many matches were played in the inaugural IPL season of 2008?

**A.** 74  
**B.** 59  
**C.** 56  
**D.** 60  

**Answer:** B  
**Difficulty:** Hard

## Q99. Which player was bought by Delhi Daredevils for Rs 16 crore at the IPL 2015 auction?

**A.** Yuvraj Singh  
**B.** Angelo Mathews  
**C.** Dinesh Karthik  
**D.** Ashish Nehra  

**Answer:** A  
**Difficulty:** Hard

## Q100. Which franchise's 14-year-old Vaibhav Suryavanshi scored a 35-ball century against Gujarat Titans in IPL 2025?

**A.** Mumbai Indians  
**B.** Rajasthan Royals  
**C.** Lucknow Super Giants  
**D.** Delhi Capitals  

**Answer:** B  
**Difficulty:** Hard
