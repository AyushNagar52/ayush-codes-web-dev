<!-- Step to Learn Git and GitHub -->


1: Git: Git is a version control system (VCS) that helps developers keep track of changes to their code over time. It allows multiple people to collaborate on the same project, track the history of changes, and manage different versions of a project efficiently.




Install Git


<!-- 1: On Mac: -->




Install Homebrew(if not already installed)
Command:
First step: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


Second Step: eval "$(/opt/homebrew/bin/brew shellenv)"


Third Step: brew install git
Fourth step: git --version


<!-- On Windows -->


Download from website: https://git-scm.com/downloads






<!-- ****************************************** -->






<!-- Configure git -->


git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"




You can verify the configuration:
git config --list




<!-- How to see hidden folder -->
In Mac: CMD + SHIFT + .
In Windows:
In Windows 10: Click on the View tab at the top, then check the box for Hidden items in the "Show/Hide" section.
In Windows 11: Click the View dropdown (three dots) in the toolbar, then select Show > Hidden items.


<!-- **************************** -->


git status
<!-- What changes are staged , not staged, untracked-->


<!-- git diff -->
q for exit
<!-- What has been changed line by line in your report. -->
<!-- it will show which parts of the report have been edited but are not yet staged for commit. -->






<!--Add file to staging area  -->
git add .


<!--Commit file -->
git commit -m "message"


<!-- Remove file from staging area -->
git reset <file>
git restore --staged <file>


<!-- Get logs of commit -->
git log
got log --oneline
git show <hash>




<!-- Revert the changes -->
git reset --hard <hashCode>
git revert <hashcode>











