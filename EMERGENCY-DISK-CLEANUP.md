# Emergency Disk Cleanup Script for Rock 5 SE Worker Node

## Critical Issue: Worker node has only 576MB free space (83% full)

### Immediate Actions on k8s-worker (192.168.1.67):

```bash
# 1. Clean up container images and build cache
sudo crictl rmi --prune
sudo ctr images prune
sudo ctr content prune

# 2. Clean up old Docker/containerd data
sudo systemctl stop containerd
sudo rm -rf /var/lib/containerd/io.containerd.content.v1.content/blobs/sha256/*
sudo systemctl start containerd

# 3. Clean up system logs
sudo journalctl --vacuum-time=1d
sudo rm -rf /var/log/*.log.1 /var/log/*.log.*.gz

# 4. Clean up package cache
sudo apt clean
sudo apt autoremove -y

# 5. Clean up temporary files
sudo rm -rf /tmp/*
sudo find /var/tmp -type f -atime +7 -delete

# 6. Remove old kernels (if any)
sudo apt autoremove --purge -y

# 7. Check space after cleanup
df -h /
```

### Long-term Solution: Expand Storage

Your worker node only has **3.4GB storage** which is insufficient for Kubernetes workloads.

**Options:**
1. **Expand SD card** if using microSD
2. **Add USB storage** and move containerd data
3. **Use NFS storage** for persistent volumes

### Immediate Workaround: Reduce Resource Usage

```bash
# Delete old failed pods to free space
kubectl delete pods --field-selector=status.phase=Failed -n trailer-rent-prod
kubectl delete pods --field-selector=status.phase=Succeeded -n trailer-rent-prod

# Limit replicas temporarily
kubectl scale deployment backend --replicas=1 -n trailer-rent-prod
kubectl scale deployment frontend --replicas=1 -n trailer-rent-prod
```

### Monitor Space Usage
```bash
# Check space regularly
watch -n 10 'df -h /'

# Monitor largest directories
du -sh /var/lib/containerd/* | sort -hr | head -10
```
