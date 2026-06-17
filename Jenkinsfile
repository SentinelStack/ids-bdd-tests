pipeline {
  agent any
  parameters { string(name: 'ENV', defaultValue: 'qa', description: 'Mediul de testare') }
  options { timestamps() }
  stages {
    stage('Install') { steps { sh 'npm ci && npx playwright install --with-deps' } }
    stage('Typecheck') { steps { sh 'npm run typecheck' } }
    stage('API tests') { steps { sh 'ENV=${ENV} npm run test:api' } }
    stage('E2E tests') { steps { sh 'ENV=${ENV} npm run test:e2e' } }
  }
  post { always { archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true } }
}
