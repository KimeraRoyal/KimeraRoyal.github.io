#---------------------------------------------------------------------------------
# SOURCES: The directory containing source HTML files
# HEADER: A file to prepend to the beginning of all target HTML files
# FOODER: A file to append to the end of all target HTML files
#---------------------------------------------------------------------------------
SOURCE := src
HEADER := $(SOURCE)/header.html
FOOTER := $(SOURCE)/footer.html
APPEND_MESSAGE := "<!-- Last modified by __USER__ on __DATE__ -->"

#---------------------------------------------------------------------------------

LINKED_FILES := $(HEADER) $(FOOTER)
SOURCE_FILES := $(filter-out $(LINKED_FILES), $(wildcard $(SOURCE)/*.html))
TARGET_FILES := $(notdir $(SOURCE_FILES))

#---------------------------------------------------------------------------------

CURRENT_USER := $(shell whoami)
CURRENT_DATE := $(shell date -I)

#---------------------------------------------------------------------------------

website : $(TARGET_FILES) $(LINKED_FILES)

%.html : $(SOURCE)/%.html $(LINKED_FILES)
	@ cat $(HEADER) > $@
	@ cat $< | sed 's/^/\t/' >> $@
	@ cat $(FOOTER) >> $@
	@ echo "" >> $@
	@ echo $(APPEND_MESSAGE) | sed 's/__USER__/$(CURRENT_USER)/;s/__DATE__/$(CURRENT_DATE)/' >> $@
