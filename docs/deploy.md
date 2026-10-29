# Deploy (manual, no CI)
From a workstation with gcloud signed in and the target project selected:

```bash
git clone https://github.com/dtredwing1/bot-team-dashboard ~/projects/bot-team-dashboard
cd ~/projects/bot-team-dashboard && git pull
./scripts/privacy-check.sh
gcloud run deploy bot-team-dashboard --source . --region us-central1 --allow-unauthenticated
```

Custom domain (one time):
```bash
gcloud beta run domain-mappings create --service bot-team-dashboard --domain bots.themottfamily.net --region us-central1
gcloud beta run domain-mappings describe --domain bots.themottfamily.net --region us-central1
```
The DNS record is a `CNAME bots -> ghs.googlehosted.com.` at the domain's DNS host. Certificates are issued automatically after DNS resolves.
