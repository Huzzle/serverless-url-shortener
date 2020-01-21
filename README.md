## Prerequisites
CLI user who runs `deploy` command should have following permissions:
```
dax:CreateCluster
dax:CreateParameterGroup
dax:CreateSubnetGroup
dax:UpdateCluster
dax:UpdateParameterGroup
dax:UpdateSubnetGroup
dax:DeleteCluster
dax:DeleteParameterGroup
dax:DeleteSubnetGroup
dax:Describe*
```

Used security group must have authorized inbound traffic on TCP port 8111.

## Install
```
$ npm ci
$ cd services/shortener
$ npm ci
$ cp .env.template .env
$ serverless deploy --stage=<stage>
```