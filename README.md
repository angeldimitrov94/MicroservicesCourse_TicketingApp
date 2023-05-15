# MicroservicesCourse_TicketingApp

*Disclaimer : this is an educational project and is not intended to be used commercially*

This is a mock application that allows authenticated (signed in) users to :
- see tickets for sale
- make orders for existing tickets for sale
- list items (tickets) for sale

# Tech Stack 
- Next.Js frontend
- Node.Js backend
- MongoDB data store
- NATS streaming server 'event bus'
- Kubernetes clusters of Docker containers containing the individual services

# Setting up the implementation from scratch : 
1) Create jwt-secret in kubernetes using : 'kubectl create secret generic jwt-secret --from-literal=JWT_KEY=...'
2) Use the latest deployment command for Kubernetes Ingress Nginx from https://kubernetes.github.io/ingress-nginx/deploy/#quick-start. This is the current one at time of writing : kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.1/deploy/static/provider/cloud/deploy.yaml