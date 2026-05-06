#!/bin/bash -l

#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=32G
#SBATCH --time=1-00:00:00
#SBATCH --mail-user=hle116@ucr.edu
#SBATCH --mail-type=ALL
#SBATCH --job-name="np_pc_prediction_models"
#SBATCH -p epyc

# Print current date
date

# Activate conda environment
module load anaconda
conda activate env1_test

# Install required packages if not already installed
pip install scikit-learn imbalanced-learn lightgbm xgboost scikit-optimize pandas numpy matplotlib

# Run the prediction models script
python Prediction_Models.py

# Print end date
date