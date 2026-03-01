terraform {
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# ─── VPC, subnets, security groups ───────────────────
# module "network" {
#   source = "terraform-aws-modules/vpc/aws"
#   # ...
# }

# ─── EKS cluster ────────────────────────────────────
# module "eks" {
#   source          = "terraform-aws-modules/eks/aws"
#   cluster_name    = var.cluster_name
#   cluster_version = "1.27"
#   # ...
# }

# ─── RDS Postgres ───────────────────────────────────
# resource "aws_db_instance" "postgres" {
#   identifier         = "${var.project}-db"
#   engine             = "postgres"
#   instance_class     = "db.t3.micro"
#   allocated_storage  = 20
#   username           = var.db_username
#   password           = var.db_password
#   skip_final_snapshot = true
# }

# ─── ECR repos ──────────────────────────────────────
# resource "aws_ecr_repository" "backend" { name = "my-backend" }
# resource "aws_ecr_repository" "frontend"{ name = "my-frontend" }
