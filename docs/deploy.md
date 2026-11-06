# Deploy (manual, no CI)

Git only syncs code. Never deploy with GitHub Actions.

Deploy from an approved machine, in this order:

1. Cloud Workbench, when it is available.
2. The home helper Pi, only when Workbench is unavailable.

From that machine, with gcloud signed in:

```bash
git clone https://github.com/dtredwing1/bot-team-dashboard ~/projects/bot-team-dashboard
cd ~/projects/bot-team-dashboard && git pull
./scripts/privacy-check.sh
gcloud run deploy bot-team-dashboard --source . --project mohawkprojecthub --region us-central1 --allow-unauthenticated
```

Do not put preview, tag, or revision addresses in production configuration. The public site stays on the canonical domain.

Custom domain (one time):
```bash
gcloud beta run domain-mappings create --service bot-team-dashboard --domain bots.themottfamily.net --region us-central1
gcloud beta run domain-mappings describe --domain bots.themottfamily.net --region us-central1
```
The DNS record is a `CNAME bots -> ghs.googlehosted.com.` at the domain's DNS host. Certificates are issued automatically after DNS resolves.
