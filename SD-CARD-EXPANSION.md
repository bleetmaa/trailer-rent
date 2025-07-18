# SD Card Partition Expansion Guide - Rock 5 SE (32GB)

## Current Issue
Your 32GB SD card is only using 3.4GB due to partition size limits.

## ⚠️ IMPORTANT: Backup First
Before resizing, backup important data from your worker node.

## Step 1: Check Current Partition Layout

On the worker node (192.168.1.67):

```bash
# Check current disk usage
df -h

# Check partition table
sudo fdisk -l /dev/mmcblk1

# Check partition layout
lsblk
```

## Step 2: Expand the Partition

### Method A: Using raspi-config (if available)
```bash
# Check if raspi-config is available
sudo raspi-config
# Navigate to: Advanced Options → Expand Filesystem
```

### Method B: Manual Resize with parted
```bash
# Resize the partition to use full disk
sudo parted /dev/mmcblk1 resizepart 2 100%

# Resize the filesystem
sudo resize2fs /dev/mmcblk1p2

# Check new size
df -h /
```

### Method C: Using growpart (recommended)
```bash
# Install cloud-utils-growpart if not available
sudo apt update && sudo apt install -y cloud-utils-growpart

# Grow the partition
sudo growpart /dev/mmcblk1 2

# Resize the filesystem
sudo resize2fs /dev/mmcblk1p2

# Verify new size
df -h /
```

## Step 3: Verify Expansion

After resizing, you should see something like:
```
/dev/mmcblk1p2   29G  2.7G   25G  10% /
```

## Step 4: Restart Kubernetes Services

```bash
# Restart containerd to clear old caches
sudo systemctl restart containerd

# Restart kubelet
sudo systemctl restart kubelet

# Clean up any remaining old data
sudo crictl rmi --prune
```

## Step 5: Re-deploy Application

Once you have more space, return to the master node and redeploy:

```bash
# On k8s-master (192.168.1.66)
kubectl delete pods --all -n trailer-rent-prod
kubectl apply -k k8s/environments/prod
```

## Alternative: Fresh Install on Full Partition

If the resize doesn't work cleanly, you might want to:

1. **Backup your kubeconfig and important files**
2. **Re-flash the SD card** with a full 32GB image
3. **Reinstall Kubernetes** using the full partition

This would give you ~28GB usable space instead of 3.4GB.

## Troubleshooting

If you encounter issues:

```bash
# Check filesystem for errors
sudo fsck /dev/mmcblk1p2

# Check dmesg for errors
dmesg | tail -20

# Verify partition table
sudo fdisk -l /dev/mmcblk1
```

After expansion, you'll have plenty of space for:
- Multiple Docker images
- Kubernetes logs
- Application data
- Container temporary files

Your Rock 5 SE will run much better with the full 32GB available! 🚀
