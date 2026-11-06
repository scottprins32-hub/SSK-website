import glob,os
g=open('src/glove.js').read()
os.makedirs('concepts',exist_ok=True)
for f in sorted(glob.glob('src/0*.html')):
    s=open(f).read().replace('/*GLOVE*/',g)
    open('concepts/'+os.path.basename(f),'w').write(s)
    print(f)
