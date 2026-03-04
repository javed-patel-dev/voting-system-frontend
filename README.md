COMPLETE SYSTEM WORKFLOW - SCHOOL TEACHER VOTING SCENARIO
Let me describe the entire system flow step-by-step so we're perfectly aligned before coding.

📚 SCENARIO: School Subject Teacher Election
Context:

Greenwood High School needs to assign subject teachers for next semester
Multiple teachers want to teach each subject (Math, Science, History, English)
Students vote to choose which teacher should teach each subject
Teacher with the most votes gets that subject
👥 USER ROLES
1. Admin (School Principal)
Hardcoded credentials in database or environment
Email: admin@greenwood.edu
Password: Admin@123
Full system control
2. Voters (Students)
Register with student email
Default role: VOTER
Can vote in active polls
Can register as candidate (teacher) during upcoming phase
3. Candidates (Teachers)
Same as voters initially
Become candidate when they register for a poll
Cannot vote in polls where they are candidates
Can vote in other polls as normal voters
🔄 COMPLETE SYSTEM FLOW
STEP 1: Admin Login & Poll Creation
Admin Actions:

Admin navigates to system

Logs in with hardcoded credentials

Sees Admin Dashboard with:

Total Polls
Total Candidates
Total Voters
Total Votes
Active Polls count
Recent voting activity
Admin clicks "Create Poll" button

Fills poll form:

Title: "Math Teacher Election 2026"
Description: "Vote for your favorite Math teacher for next semester. 
              The winner will teach Advanced Mathematics."
Start Date: March 10, 2026 10:00 AM
End Date: March 15, 2026 5:00 PM

Poll is created with status: "UPCOMING"

Poll States:

UPCOMING: Before start date (candidates can register)
ACTIVE: Between start and end date (voting open)
ENDED: After end date (results shown, voting stopped)
STEP 2: Student Registration (Voters)
Student Registration Flow:

New student visits website
Clicks "Register"
Enters details:
Name: John Smith
Email: john.smith@student.greenwood.edu
Password: ********

System sends OTP to email
Student enters OTP
Account created with role: VOTER
Auto-login after verification
Multiple students register:

John Smith (Student)
Sarah Johnson (Student)
Mike Wilson (Student)
Mr. David Brown (Teacher)
Ms. Emily Davis (Teacher)
Mr. Robert Miller (Teacher)
STEP 3: Candidate Registration (During UPCOMING Phase)
Teacher Candidate Registration:

Scenario A: Mr. David Brown registers for Math Teacher poll

Mr. David Brown logs in as voter

Sees list of polls on homepage

Sees "Math Teacher Election 2026" with badge: "UPCOMING"

Clicks on the poll card

Sees poll details page with:

Poll title & description
Start/end dates
Timer showing "Starts in 6 days"
"Register as Candidate" button (visible because status is UPCOMING)
Current candidates list (empty initially)
Clicks "Register as Candidate"

Modal/form opens:
Candidate Name: Mr. David Brown (pre-filled)
Manifesto/Description:
"10 years of teaching experience. 
 PhD in Mathematics from MIT.
 Won Best Teacher Award 2024.
 I will make math fun and easy!"


Submits registration

System creates candidate record:
{
  userId: "davids_user_id",
  pollId: "math_poll_id",
  manifesto: "10 years of teaching...",
  createdAt: "2026-03-04T10:00:00Z"
}


Mr. David Brown now appears in candidates list on poll page

Similarly:

Ms. Emily Davis registers for Math poll with her manifesto
Mr. Robert Miller registers for Math poll with his manifesto
Key Points:

✅ Mr. David CAN register as candidate while poll is UPCOMING
✅ Mr. David CANNOT vote in Math poll (because he's a candidate there)
✅ Mr. David CAN still vote in "Science Teacher" poll as a normal voter
✅ User role in database stays "VOTER" (role is poll-contextual, not global)
STEP 4: Voting Phase (During ACTIVE Phase)
When poll becomes ACTIVE (March 10, 2026 10:00 AM):

Student Voting Flow:

John Smith logs in

Goes to homepage

Sees "Math Teacher Election 2026" with badge: "ACTIVE NOW" (green)

Clicks on poll

Sees poll page with:

Poll details
Timer showing "Ends in 5 days 7 hours"
List of candidates with their manifestos:
[Candidate Card 1]
👤 Mr. David Brown
📝 "10 years of teaching experience..."
🗳️ Current Votes: 0
[Vote Button]

[Candidate Card 2]
👤 Ms. Emily Davis
📝 "Passionate about mathematics..."
🗳️ Current Votes: 0
[Vote Button]

[Candidate Card 3]
👤 Mr. Robert Miller
📝 "Award-winning educator..."
🗳️ Current Votes: 0
[Vote Button]

John reads manifestos

Clicks [Vote] button for Mr. David Brown

Confirmation dialog:
⚠️ Are you sure you want to vote for Mr. David Brown?
You cannot change your vote once submitted.
[Cancel] [Confirm Vote]


John clicks [Confirm Vote]

System validates:

✅ Poll is ACTIVE
✅ John hasn't voted in this poll before
✅ John is not a candidate in this poll
Vote recorded in database:
{
  voter: "johns_user_id",
  candidateId: "david_candidate_id",
  pollId: "math_poll_id",
  createdAt: "2026-03-10T10:30:00Z"
}


Success message: "✅ Vote cast successfully!"

Page refreshes, now shows:
✅ You have already voted in this poll
Thank you for participating!

Current Results:
👤 Mr. David Brown - 1 vote
👤 Ms. Emily Davis - 0 votes
👤 Mr. Robert Miller - 0 votes


Other students vote:

Sarah Johnson votes for Ms. Emily Davis
Mike Wilson votes for Mr. David Brown
50 more students vote...
Vote Distribution:

Mr. David Brown: 28 votes
Ms. Emily Davis: 15 votes
Mr. Robert Miller: 10 votes
What Students CANNOT See:

❌ Who voted for whom (anonymous)
❌ Individual voter names
What Students CAN See:

✅ Total vote count per candidate
✅ Their own voting status
✅ Live vote counts updating
STEP 5: Poll Ends & Result Declaration (After END DATE)
Automatic Result Declaration:

When March 15, 2026 5:00 PM arrives:

System automatically detects poll end time
Poll status changes to: "ENDED"
System triggers result declaration:
Calculates final votes
Determines winner: Mr. David Brown (28 votes)
Sends congratulations email to winner:
📧 Email to: david.brown@teacher.greenwood.edu
Subject: 🎉 Congratulations! You Won the Math Teacher Election

Dear Mr. David Brown,

Congratulations! You have won the Math Teacher Election 2026 
with 28 votes out of 53 total votes!

You will be teaching Advanced Mathematics next semester.

Poll Details:
- Poll: Math Teacher Election 2026
- Total Candidates: 3
- Total Votes: 53
- Your Votes: 28
- Winning Margin: 13 votes

Thank you for your participation!

Best regards,
Greenwood High School Administration

Poll page now shows:
🏆 POLL RESULTS

Status: ENDED ⏹️
Voting Period: March 10 - March 15, 2026

🥇 WINNER: Mr. David Brown
   28 votes (52.8%)
   📝 "10 years of teaching experience..."

🥈 Ms. Emily Davis
   15 votes (28.3%)
   📝 "Passionate about mathematics..."

🥉 Mr. Robert Miller
   10 votes (18.9%)
   📝 "Award-winning educator..."

Total Votes Cast: 53
Total Eligible Voters: 75
Turnout: 70.7%

⚠️ Voting is now closed

[Vote] buttons are disabled/hidden
Students can view results but cannot vote
STEP 6: Admin Analytics Panel
Admin Full Analytics Dashboard:

Dashboard Overview:
📊 SYSTEM-WIDE ANALYTICS

[Cards Row 1]
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Total Polls     │ │ Total Candidates│ │ Total Voters    │ │ Total Votes     │
│      12         │ │      45         │ │     150         │ │     523         │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘

[Cards Row 2]
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Active Polls    │ │ Ended Polls     │ │ Recent Activity │
│       3         │ │       7         │ │   24 votes/day  │
└─────────────────┘ └─────────────────┘ └─────────────────┘

📈 TRENDING CANDIDATES (Top 5)
1. Mr. David Brown - 28 votes across 1 poll
2. Dr. Sarah Mitchell - 35 votes across 2 polls
3. Ms. Emily Davis - 42 votes across 3 polls
...

📊 POPULAR POLLS (Most Engagement)
1. Science Teacher Election - 89 votes
2. Math Teacher Election - 53 votes
3. English Teacher Election - 45 votes


Poll-Specific Analytics:

Admin clicks on "Math Teacher Election 2026":
📋 POLL DETAILS

Math Teacher Election 2026
Status: ENDED
Period: March 10 - March 15, 2026

─────────────────────────────────────

📊 VOTING STATISTICS

Total Candidates: 3
Total Votes Cast: 53
Eligible Voters: 75
Turnout: 70.7%
Winner: Mr. David Brown (28 votes)

─────────────────────────────────────

🎯 CANDIDATE PERFORMANCE

[Expandable Section: Mr. David Brown]
📊 Total Votes: 28 (52.8%)
📧 Email: david.brown@teacher.greenwood.edu
📝 Manifesto: "10 years of teaching experience..."

👥 VOTERS WHO VOTED FOR THIS CANDIDATE (28):
┌────────────────────────────────────────────────────┐
│ Name              Email                   Voted At  │
├────────────────────────────────────────────────────┤
│ John Smith       john@student.greenwood   10:30 AM │
│ Mike Wilson      mike@student.greenwood   11:45 AM │
│ Lisa Anderson    lisa@student.greenwood   2:15 PM  │
│ ...              ...                      ...      │
└────────────────────────────────────────────────────┘

[Download CSV] [Export Report]

[Expandable Section: Ms. Emily Davis]
📊 Total Votes: 15 (28.3%)
👥 Voters: [Similar table]

[Expandable Section: Mr. Robert Miller]
📊 Total Votes: 10 (18.9%)
👥 Voters: [Similar table]

─────────────────────────────────────

⏱️ VOTING TIMELINE
[Chart showing votes over time]
Day 1: 15 votes
Day 2: 12 votes
Day 3: 8 votes
Day 4: 10 votes
Day 5: 8 votes

─────────────────────────────────────

📥 ACTIONS
[Re-open Poll] [Delete Poll] [Export Full Report]

Admin Can See:

✅ Complete voter list for each candidate
✅ Who voted for whom (full transparency for admin)
✅ Timestamps of each vote
✅ Voter contact details
✅ Export functionality
✅ Voting patterns and trends
Key Admin Features:

View all polls (active, upcoming, ended)
Create/edit/delete polls
View detailed analytics per poll
See voter breakdown per candidate
Export reports
View system-wide statistics
See trending candidates across polls
Monitor real-time voting activity
🔐 PRIVACY & SECURITY
For Students (Public View):
❌ Cannot see who voted for whom
✅ Can see vote counts per candidate
✅ Can see their own voting status
❌ Cannot change vote after submission
For Admin (Full Access):
✅ Complete voter details per candidate
✅ Voting timestamps
✅ Voter contact information
✅ Full system analytics
✅ Export capabilities