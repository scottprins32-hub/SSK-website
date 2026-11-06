import glob,os,sys
d=open('src/data.js').read()
out=sys.argv[1] if len(sys.argv)>1 else 'concepts'
os.makedirs(out,exist_ok=True)
for f in sorted(glob.glob('src/0*.html')):
    open(os.path.join(out,os.path.basename(f)),'w').write(open(f).read().replace('/*DATA*/',d))
