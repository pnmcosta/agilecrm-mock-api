git remote add vsts https://$(System.AccessToken)@pmcdigital.visualstudio.com/DefaultCollection/PMC/_git/agilecrm-mock-api
git checkout -b vsts-merge
git pull vsts master
rm merge.bat
git push origin vsts-merge:master